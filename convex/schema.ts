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
});
