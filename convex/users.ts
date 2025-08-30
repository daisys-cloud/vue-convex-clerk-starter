/**
 * @fileoverview User management functions for the Vue + Convex + Clerk authentication system.
 *
 * This module provides CRUD operations for user data, including:
 * - Creating new users from Clerk authentication
 * - Retrieving current user information
 * - Updating user profile data
 *
 * All functions include proper authentication checks and data validation.
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { mutation, query } from "./_generated/server";

/**
 * Creates a new user in the database or returns existing user ID.
 *
 * This function is called when a user first authenticates with Clerk.
 * It checks if a user already exists with the given Clerk ID and either
 * returns the existing user's ID or creates a new user record.
 *
 * @param ctx - The Convex context containing authentication and database access
 * @returns Promise<string> - The user ID (either existing or newly created)
 *
 * @throws {Error} When user is not authenticated
 *
 * @example
 * ```typescript
 * const userId = await getOrCreateUser();
 * ```
 */
export const getOrCreateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (existingUser) return existingUser._id;

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email || "",
      name: `${identity.givenName || ""} ${identity.familyName || ""}`.trim(),
      createdAt: Date.now(),
    });
  },
});

/**
 * Retrieves the current authenticated user's profile information.
 *
 * This query function fetches the user data for the currently authenticated
 * user based on their Clerk identity. Returns null if no user is authenticated
 * or if the user doesn't exist in the database.
 *
 * @param ctx - The Convex context containing authentication and database access
 * @returns Promise<User | null> - The current user's profile data or null if not found
 *
 * @example
 * ```typescript
 * const currentUser = await getCurrentUser();
 * if (currentUser) {
 *   console.log(`Welcome, ${currentUser.name}!`);
 * }
 * ```
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

/**
 * Updates user profile data or creates a new user if one doesn't exist.
 *
 * This mutation function provides an upsert operation for user data. It validates
 * the input parameters, ensures the authenticated user can only update their own
 * data, and either updates an existing user record or creates a new one.
 *
 * @param ctx - The Convex context containing authentication and database access
 * @param args - Object containing user data to update
 * @param args.clerkId - The Clerk user ID (must match authenticated user)
 * @param args.email - The user's email address
 * @param args.name - The user's display name
 * @returns Promise<string> - The user ID of the updated/created user
 *
 * @throws {Error} When required fields are missing
 * @throws {Error} When email format is invalid
 * @throws {Error} When user is not authenticated
 * @throws {Error} When user tries to update another user's data
 *
 * @example
 * ```typescript
 * const userId = await updateUserData({
 *   clerkId: "user_123",
 *   email: "user@example.com",
 *   name: "John Doe"
 * });
 * ```
 */
export const updateUserData = mutation({
  handler: async (
    ctx,
    args: { clerkId: string; email: string; name: string }
  ) => {
    // Validate inputs
    if (!args.clerkId || !args.email) {
      throw new Error("Missing required fields: clerkId and email");
    }

    if (!args.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify the user is updating their own data
    if (identity.subject !== args.clerkId) {
      throw new Error("Unauthorized");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });
    } else {
      // Create new user if doesn't exist
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        createdAt: Date.now(),
      });
    }
  },
});
