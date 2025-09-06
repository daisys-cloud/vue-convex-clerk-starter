/**
 * @fileoverview Notes management functions for billable work tracking.
 *
 * This module provides CRUD operations for notes with billing functionality:
 * - Creating new work notes with billing information
 * - Retrieving notes by user or billing status
 * - Updating existing notes and billing status
 * - Deleting notes
 *
 * All functions include proper authentication checks and data validation.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new note
 */
export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    billable: v.boolean(),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      createdBy: user._id,
      createdAt: Date.now(),
      billable: args.billable,
      duration: args.duration,
      billStatus: "open" as const,
    });
  },
});

/**
 * Get all notes (for admin/debug purposes)
 */
export const getAllNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").order("desc").collect();
  },
});

/**
 * Get notes for the current user only
 */
export const getUserNotes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return [];

    return await ctx.db.query("notes")
      .withIndex("by_user", (q) => q.eq("createdBy", user._id))
      .order("desc")
      .collect();
  },
});


/**
 * Update an existing note
 */
export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    billable: v.optional(v.boolean()),
    duration: v.optional(v.number()),
    billStatus: v.optional(v.union(v.literal("open"), v.literal("billed"), v.literal("canceled"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");

    // Get the user record to verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || note.createdBy !== user._id) {
      throw new Error("Not authorized to update this note");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.billable !== undefined) updates.billable = args.billable;
    if (args.duration !== undefined) updates.duration = args.duration;
    if (args.billStatus !== undefined) updates.billStatus = args.billStatus;

    return await ctx.db.patch(args.id, updates);
  },
});

/**
 * Delete a note
 */
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");

    // Get the user record to verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || note.createdBy !== user._id) {
      throw new Error("Not authorized to delete this note");
    }

    return await ctx.db.delete(args.id);
  },
});

