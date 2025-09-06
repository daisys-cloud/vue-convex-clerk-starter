# Convex Backend Functions

This directory contains the Convex backend functions for the Vue + Clerk starter template.

## 📁 File Structure

```
convex/
├── _generated/          # Auto-generated API types
├── auth.config.js      # Clerk authentication setup
├── schema.ts           # Database schema definition
├── helpers.ts          # Reusable auth & utility functions
├── users.ts            # User management functions
└── notes.ts            # Notes CRUD operations
```

## 🔧 Core Functions

### **User Management (users.ts)**
```typescript
// Get current authenticated user
const user = useConvexQuery(api.users.getCurrentUser);

// Create/update user (called by ConvexProvider)
const storeUser = useConvexMutation(api.users.store);
```

### **Notes Operations (notes.ts)**
```typescript
// Get notes with filtering
const notes = useConvexQuery(api.notes.getNotes, {
  filters: { createdByCurrentUser: true }
});

// Create a new note
const createNote = useConvexMutation(api.notes.createNote);
const noteId = await createNote({
  title: "My Note",
  content: "Note content",
  billable: true,
  duration: 60
});

// Update existing note
const updateNote = useConvexMutation(api.notes.updateNote);
await updateNote({
  id: noteId,
  title: "Updated Title",
  billStatus: "billed"
});

// Delete note
const deleteNote = useConvexMutation(api.notes.deleteNote);
await deleteNote({ id: noteId });
```

### **Helper Functions (helpers.ts)**
```typescript
// Used internally by other functions
await requireAuth(ctx);           // Require authentication
const { user } = await requireUser(ctx);  // Get authenticated user
const user = await getCurrentUserOptional(ctx);  // Optional user
```

## 🛡️ Security Features

### **Authentication Guards**
All functions use helper functions for consistent authentication:
```typescript
export const myFunction = mutation({
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);  // Always authenticate
    // Function logic here
  }
});
```

### **User Isolation**
Users can only access their own data:
```typescript
// Check ownership before operations
if (note.createdBy !== user._id) {
  throw new ConvexError("Not authorized");
}
```

### **Input Validation**
Comprehensive server-side validation:
```typescript
const title = args.title.trim();
if (title.length === 0 || title.length > 200) {
  throw new ConvexError("Title must be between 1 and 200 characters");
}
```

## 📊 Database Schema

### **Users Table**
```typescript
users: defineTable({
  clerkId: v.string(),      // Clerk user ID (unique)
  email: v.string(),        // User email
  name: v.string(),         // Display name
  createdAt: v.number(),    // Creation timestamp
}).index("by_clerk_id", ["clerkId"])
```

### **Notes Table**
```typescript
notes: defineTable({
  title: v.string(),        // Note title (1-200 chars)
  content: v.string(),      // Note content (1-5000 chars)
  createdBy: v.id("users"), // User reference
  billable: v.boolean(),    // Is this billable work?
  duration: v.optional(v.number()), // Duration in minutes
  billStatus: v.union(      // Billing status
    v.literal("open"),
    v.literal("billed"),
    v.literal("canceled")
  ),
  createdAt: v.number(),    // Creation timestamp
})
.index("by_user", ["createdBy"])
.index("by_bill_status", ["billStatus"])
```

## ⚡ Performance Features

### **Smart Indexing**
Optimized queries with proper indexes:
```typescript
// Efficient user lookup
.withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))

// Fast user-specific queries
.withIndex("by_user", (q) => q.eq("createdBy", user._id))

// Billing status filtering
.withIndex("by_bill_status", (q) => q.eq("billStatus", "open"))
```

### **Backend Filtering**
Filtering happens on the server for better performance:
```typescript
const notes = await getNotes({ 
  filters: { 
    createdByCurrentUser: true,
    billStatus: "open"
  }
});
```

## 🚀 Local Development

### **Start Local Server**
```bash
npx convex dev
```

### **Dashboard Access**
- Local dashboard: `http://localhost:3210`
- View real-time data, logs, and function calls
- Debug authentication and data flow

### **TypeScript Integration**
Auto-generated types provide full type safety:
```typescript
import { api } from "../convex/_generated/api";
import type { Doc, Id } from "../convex/_generated/dataModel";

type Note = Doc<"notes">;
type NoteId = Id<"notes">;
```

## 📚 Learn More

- **[Convex Docs](https://docs.convex.dev/)** - Complete documentation
- **[Vue Integration](https://docs.convex.dev/client/vue)** - Vue-specific guides
- **[Authentication](https://docs.convex.dev/auth/clerk)** - Clerk + Convex setup
- **[Database](https://docs.convex.dev/database)** - Schema and queries

---

*These functions power a complete CRUD application with enterprise-grade security and performance.*