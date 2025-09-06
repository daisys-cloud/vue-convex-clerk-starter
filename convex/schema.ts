/**
 * @fileoverview Database schema definition for the Vue + Convex + Clerk authentication system.
 *
 * This module defines the structure of all database tables including:
 * - Users table for storing authenticated user profiles
 * - Messages table for storing user-generated content
 *
 * The schema includes proper indexing for performance optimization
 * and data integrity constraints.
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Main database schema configuration.
 *
 * Defines all tables, their fields, and indexes for the application.
 * Each table is optimized for common query patterns and includes
 * proper validation rules for data integrity.
 */
export default defineSchema({
  /**
   * Users table for storing authenticated user information.
   *
   * This table stores user profiles that are synced with Clerk authentication.
   * Each user has a unique Clerk ID and can have associated messages.
   *
   * @field clerkId - Unique identifier from Clerk authentication service
   * @field email - User's email address (required)
   * @field name - User's display name (optional)
   * @field createdAt - Timestamp when user was first created
   */
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  /**
   * Messages table for storing user-generated content.
   *
   * This table stores messages created by authenticated users.
   * Each message is linked to a user through the userId field.
   *
   * @field text - The message content text
   * @field userId - Reference to the user who created the message
   * @field createdAt - Timestamp when message was created
   */
  messages: defineTable({
    text: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  }),

  /**
   * Notes table for storing billable work notes and time tracking.
   *
   * This table stores detailed work notes with billing information.
   * Each note is linked to a user and includes billing status tracking.
   *
   * @field title - Title/summary of the work done
   * @field content - Detailed description of the work
   * @field createdBy - Reference to the user who created the note
   * @field createdAt - Timestamp when note was created
   * @field billable - Whether this work is billable (true/false)
   * @field duration - Duration in minutes (optional)
   * @field billStatus - Billing status: "open", "billed", "canceled"
   */
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    billable: v.boolean(),
    duration: v.optional(v.number()),
    billStatus: v.union(v.literal("open"), v.literal("billed"), v.literal("canceled")),
  }).index("by_user", ["createdBy"]).index("by_bill_status", ["billStatus"]),

});
