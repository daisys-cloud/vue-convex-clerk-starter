/**
 * @fileoverview Main Application Entry Point
 *
 * This is the primary entry point for the Vue + Convex + Clerk authentication application.
 * It initializes the Vue application, configures authentication with Clerk,
 * sets up the Convex backend connection, and mounts the application to the DOM.
 *
 * Key responsibilities:
 * - Create and configure the Vue application instance
 * - Initialize Clerk authentication plugin with environment variables
 * - Configure Convex backend connection
 * - Mount the application to the DOM
 *
 * Environment variables required:
 * - VITE_CLERK_PUBLISHABLE_KEY: Clerk's publishable key for authentication
 * - VITE_CONVEX_URL: Convex backend deployment URL
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { createApp } from "vue";
import { clerkPlugin } from "@clerk/vue";
import { convexVue } from "convex-vue";
import App from "./App.vue";

/**
 * Create the main Vue application instance.
 * This instance will be configured with plugins and mounted to the DOM.
 */
const app = createApp(App);

/**
 * Configure Clerk authentication plugin.
 *
 * Clerk provides user authentication, user management, and session handling.
 * The plugin is configured with the publishable key from environment variables,
 * which is required for the authentication system to function properly.
 *
 * @see https://clerk.com/docs
 */
app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
});

/**
 * Configure Convex backend plugin.
 *
 * Convex provides the backend database, real-time subscriptions, and
 * serverless functions. The plugin is configured with the deployment
 * URL from environment variables to connect to the correct backend.
 *
 * @see https://docs.convex.dev
 */
app.use(convexVue, {
  url: import.meta.env.VITE_CONVEX_URL,
});

/**
 * Mount the configured application to the DOM.
 *
 * This renders the Vue application in the HTML element with id "app".
 * The application will now be interactive and respond to user actions.
 */
app.mount("#app");
