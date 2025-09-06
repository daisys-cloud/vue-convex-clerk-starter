/**
 * @fileoverview User management functions for the Vue + Convex + Clerk authentication system.
 *
 * This module provides a function to store and update user data from Clerk webhooks
 * or frontend calls, ensuring that the Convex database is in sync with Clerk's user records.
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.1.0
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Retrieves the current authenticated user's profile information.
 *
 * This query function fetches the user data for the currently authenticated
 * user based on their Clerk identity. Returns null if no user is authenticated
 * or if the user doesn't exist in the database.
 *
 * @param ctx - The Convex context containing authentication and database access
 * @returns Promise<User | null> - The current user's profile data or null if not found
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
 * Stores a new user in the database or updates an existing one.
 *
 * This mutation is called when a user first authenticates or when their
 * data changes in Clerk. It ensures the user record in Convex is always
 * up-to-date with the Clerk identity.
 *
 * @param ctx - The Convex context containing authentication and database access
 * @returns Promise<string> - The user ID (either existing or newly created)
 */
export const store = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this user.
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this user before, update their details.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // If it's a new user, create a new record.
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      name: identity.name!,
      createdAt: Date.now(),
    });
  },
});