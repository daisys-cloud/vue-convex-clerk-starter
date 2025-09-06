/**
 * @fileoverview Reusable helper functions for authentication and user management
 * 
 * This module provides centralized helper functions to reduce code duplication
 * across Convex queries and mutations. It follows the DRY principle by 
 * consolidating common authentication and user lookup patterns.
 */

import { QueryCtx, MutationCtx } from "./_generated/server";
import { ConvexError } from "convex/values";
import type { Doc } from "./_generated/dataModel";

/**
 * Basic authentication check - throws error if user is not authenticated
 * 
 * This is the "gateway" function that should be called at the beginning
 * of every protected query and mutation. It ensures that only authenticated
 * users can access protected resources.
 * 
 * @param ctx - Query or Mutation context
 * @returns The user's identity from Clerk
 * @throws ConvexError if user is not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }
  return identity;
}

/**
 * Combined authentication and user lookup - for most mutations
 * 
 * This function performs both authentication and user database lookup
 * in a single call, which is the most common pattern for mutations
 * that need to associate data with a specific user.
 * 
 * @param ctx - Query or Mutation context  
 * @returns Object containing both identity and user record
 * @throws ConvexError if not authenticated or user not found
 */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await requireAuth(ctx);
  
  try {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique(); // Consistent with users.ts - detects duplicates
    
    if (!user) {
      throw new ConvexError("User not found in database");
    }
    
    return { identity, user };
  } catch (error) {
    console.error("Duplicate user found for clerkId:", identity.subject, error);
    throw new ConvexError("Database integrity error: Duplicate user found");
  }
}

/**
 * Optional user lookup - for flexible queries that may or may not need user context
 * 
 * This function is useful for queries that can work both for authenticated
 * and unauthenticated users, or where user context is optional.
 * 
 * @param ctx - Query or Mutation context
 * @returns User record or null if not authenticated/found
 */
export async function getCurrentUserOptional(ctx: QueryCtx | MutationCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  
  try {
    // Returns user or null, throws error on duplicates
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique(); // Consistent with users.ts - detects duplicates
  } catch (error) {
    console.error("Duplicate user found for clerkId:", identity.subject, error);
    return null; // Don't break frontend, but log error for debugging
  }
}