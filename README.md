# Vue + Convex + Clerk Authentication System

A modern, full-stack web application demonstrating secure user authentication and real-time data management using Vue 3, Convex backend, and Clerk authentication.

## 🚀 What This App Does

This application is a **user authentication and profile management system** that showcases:

- **Secure User Authentication**: Complete sign-in/sign-up flow using Clerk
- **Real-time Data Sync**: Automatic synchronization between Clerk user data and Convex database
- **Profile Management**: Display and update user profile information
- **Modern Architecture**: Built with Vue 3 Composition API, TypeScript, and Vite
- **Backend-as-a-Service**: Serverless backend powered by Convex with real-time subscriptions

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue 3 Frontend │◄──►│  Clerk Auth     │◄──►│  Convex Backend │
│                 │    │                 │    │                 │
│ • Components    │    │ • User Mgmt     │    │ • Database      │
│ • State Mgmt    │    │ • JWT Tokens    │    │ • Real-time     │
│ • Auth Flow     │    │ • Sessions      │    │ • Functions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Frontend**: Vue 3 with Composition API and TypeScript
- **Authentication**: Clerk handles user management and JWT tokens
- **Backend**: Convex provides database, real-time subscriptions, and serverless functions
- **Data Flow**: Automatic sync between Clerk user data and Convex database

## 🛠️ Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Vue Router** - Official router for Vue.js

### Authentication
- **Clerk** - Complete authentication and user management solution
- **JWT Tokens** - Secure authentication between frontend and backend

### Backend
- **Convex** - Backend-as-a-service with real-time database
- **Real-time Subscriptions** - Live data updates across clients
- **Serverless Functions** - Automatic scaling and deployment

## 📁 Project Structure

```
vue-convex-clerk-auth/
├── convex/                    # Convex backend
│   ├── _generated/           # Auto-generated types and API
│   ├── auth.config.js        # Authentication configuration
│   ├── schema.ts             # Database schema definition
│   └── users.ts              # User management functions
├── src/                      # Vue frontend source
│   ├── components/           # Vue components
│   │   ├── ConvexProvider.vue # Convex client provider
│   │   └── UserProfile.vue   # User profile display
│   ├── App.vue               # Main application component
│   └── main.ts               # Application entry point
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔧 Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Clerk account and application
- Convex account and project

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd vue-convex-clerk-auth
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Convex Configuration
VITE_CONVEX_URL=https://your-project.convex.cloud

# Convex Backend (for auth.config.js)
CLERK_JWT_ISSUER_DOMAIN=https://clerk.your-domain.com
```

### 3. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure JWT template for Convex:
   - Go to JWT Templates in Clerk dashboard
   - Choose Convex from the pre-built templates
   - Save
   - Copy the publishable key to your `.env` file - `VITE_CLERK_PUBLISHABLE_KEY`
   - Copy the jwt issuer domain to your `.env` file - `CLERK_JWT_ISSUER_DOMAIN`

### 4. Convex Setup

1. Create a Convex project at [convex.dev](https://convex.dev)
2. Deploy your backend:
   ```bash
   npx convex dev
   ```
3. Copy the deployment URL to your `.env` file

### 5. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 🔐 Authentication Flow

### 1. User Signs In
- User clicks "Sign In" button
- Clerk handles authentication (OAuth, email/password, etc.)
- JWT token is generated for Convex

### 2. Data Synchronization
- `ConvexProvider` component receives user data
- User profile is automatically synced to Convex database
- Real-time connection is established

### 3. Profile Display
- `UserProfile` component fetches user data from Convex
- Profile information is displayed in real-time
- Changes in Clerk automatically update Convex

## 📊 Database Schema

### Users Table
```typescript
{
  clerkId: string,      // Unique Clerk user identifier
  email: string,        // User's email address
  name: string,         // User's display name
  createdAt: number     // Timestamp of user creation
}
```


## 🚀 Key Features

### Real-time Data Sync
- Automatic synchronization between Clerk and Convex
- Real-time updates across all connected clients
- No manual refresh required

### Secure Authentication
- JWT-based authentication with Clerk
- Secure token validation in Convex
- User can only access their own data

### Modern Development Experience
- Hot module replacement with Vite
- TypeScript for type safety
- Vue 3 Composition API for clean component logic

## 🔍 API Functions

### User Management
- `getOrCreateUser()` - Creates or retrieves user record
- `getCurrentUser()` - Fetches current user's profile
- `updateUserData()` - Updates user profile information

### Database Operations
- Automatic user creation on first authentication
- Real-time profile updates
- Secure data access with authentication checks

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

### Development Workflow

1. **Frontend Changes**: Edit Vue components in `src/`
2. **Backend Changes**: Modify Convex functions in `convex/`
3. **Schema Changes**: Update `convex/schema.ts` and run `npx convex dev`
4. **Real-time Testing**: Changes automatically sync across browser tabs

## 🚀 Deployment

### Frontend Deployment
- Build the application: `npm run build`
- Deploy the `dist/` folder to your hosting service
- Set environment variables in your hosting platform

### Backend Deployment
- Convex automatically deploys when you run `npx convex dev`
- For production, use `npx convex deploy`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: Users can only access their own data
- **Input Validation**: Server-side validation of all inputs
- **Environment Variables**: Sensitive data stored securely

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper JSDoc documentation
4. Test thoroughly
5. Submit a pull request

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the documentation links above
2. Review environment variable configuration
3. Ensure all services (Clerk, Convex) are properly configured
4. Check browser console for error messages

---

**Built with ❤️ using Vue 3, Convex, and Clerk**
