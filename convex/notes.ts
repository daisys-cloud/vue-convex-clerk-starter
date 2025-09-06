/**
 * @fileoverview Notes management functions for billable work tracking.
 *
 * This module provides CRUD operations for notes with billing functionality:
 * - Creating new work notes with billing information
 * - Retrieving notes with flexible filtering (all or user-specific)
 * - Updating existing notes and billing status
 * - Deleting notes
 *
 * All functions include proper authentication checks and data validation.
 * Uses helper functions to eliminate code duplication (DRY principle).
 */

import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireAuth, requireUser, getCurrentUserOptional } from "./helpers";
import type { Doc } from "./_generated/dataModel";

/**
 * Create a new note with input validation and sanitization
 */
export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    billable: v.boolean(),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    // Input validation and sanitization
    const title = args.title.trim();
    const content = args.content.trim();
    
    if (title.length === 0 || title.length > 200) {
      throw new ConvexError("Title must be between 1 and 200 characters");
    }
    
    if (content.length === 0 || content.length > 5000) {
      throw new ConvexError("Content must be between 1 and 5000 characters");
    }
    
    if (args.duration !== undefined && (args.duration < 0 || args.duration > 1440)) {
      throw new ConvexError("Duration must be between 0 and 1440 minutes");
    }

    return await ctx.db.insert("notes", {
      title,
      content,
      createdBy: user._id,
      createdAt: Date.now(),
      billable: args.billable,
      duration: args.duration,
      billStatus: "open" as const,
    });
  },
});

/**
 * Get notes with flexible filtering - future-proof architecture
 * 
 * This query supports multiple filter combinations and can be easily extended
 * with new filter options without breaking existing code. Always requires authentication.
 */
export const getNotes = query({
  args: {
    filters: v.optional(v.object({
      createdByCurrentUser: v.optional(v.boolean()),
      billStatus: v.optional(v.union(v.literal("open"), v.literal("billed"), v.literal("canceled"))),
      // Future filters can be added here without breaking changes:
      // searchText: v.optional(v.string()),
      // dateRange: v.optional(v.object({ from: v.number(), to: v.number() })),
      // billable: v.optional(v.boolean()),
    }))
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx); // SECURITY: Always require authentication
    
    // Default to empty filters if none provided (backward compatibility)
    const filters = args.filters ?? {};
    
    // Determine optimal query strategy based on filter combination
    if (filters.createdByCurrentUser && filters.billStatus) {
      // COMBINED FILTERS: Use primary index + filter for best performance
      const user = await getCurrentUserOptional(ctx);
      if (!user) return [];
      
      const billStatus = filters.billStatus;
      return await ctx.db.query("notes")
        .withIndex("by_user", (q) => q.eq("createdBy", user._id))
        .filter((q) => q.eq(q.field("billStatus"), billStatus))
        .order("desc")
        .collect();
        
    } else if (filters.createdByCurrentUser) {
      // USER FILTER ONLY: Use user index for optimal performance
      const user = await getCurrentUserOptional(ctx);
      if (!user) return [];
      
      return await ctx.db.query("notes")
        .withIndex("by_user", (q) => q.eq("createdBy", user._id))
        .order("desc")
        .collect();
        
    } else if (filters.billStatus) {
      // BILL STATUS FILTER ONLY: Use bill status index for optimal performance
      const billStatus = filters.billStatus;
      return await ctx.db.query("notes")
        .withIndex("by_bill_status", (q) => q.eq("billStatus", billStatus))
        .order("desc")
        .collect();
    }
    
    // DEFAULT: No filters - return all notes (for admin/debug purposes)
    return await ctx.db.query("notes").order("desc").collect();
  },
});


/**
 * Update an existing note with validation and ownership verification
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
    const { user } = await requireUser(ctx);
    
    const note = await ctx.db.get(args.id);
    if (!note) throw new ConvexError("Note not found");
    
    // Type assertion for note document
    const typedNote = note as Doc<"notes">;
    
    if (typedNote.createdBy !== user._id) {
      throw new ConvexError("Not authorized to update this note");
    }

    // Elegant destructuring: separate ID from update data
    const { id, ...updates } = args;
    
    // Validate and sanitize string fields if provided
    if (updates.title !== undefined) {
      const title = updates.title.trim();
      if (title.length === 0 || title.length > 200) {
        throw new ConvexError("Title must be between 1 and 200 characters");
      }
      updates.title = title;
    }
    
    if (updates.content !== undefined) {
      const content = updates.content.trim();
      if (content.length === 0 || content.length > 5000) {
        throw new ConvexError("Content must be between 1 and 5000 characters");
      }
      updates.content = content;
    }
    
    if (updates.duration !== undefined) {
      if (updates.duration < 0 || updates.duration > 1440) {
        throw new ConvexError("Duration must be between 0 and 1440 minutes");
      }
    }
    
    // Convex automatically ignores undefined values
    return await ctx.db.patch(id, updates);
  },
});

/**
 * Delete a note with ownership verification
 */
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);
    
    const note = await ctx.db.get(args.id);
    if (!note) throw new ConvexError("Note not found");
    
    // Type assertion for note document
    const typedNote = note as Doc<"notes">;
    
    if (typedNote.createdBy !== user._id) {
      throw new ConvexError("Not authorized to delete this note");
    }

    return await ctx.db.delete(args.id);
  },
});

