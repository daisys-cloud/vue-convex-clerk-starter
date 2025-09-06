<template>
  <div v-if="!isReady" class="convex-loading">
    <LoadingSpinner
      size="medium"
      color="success"
      text="Connecting to database..."
    />
  </div>
  <div v-else-if="authError" class="auth-error">
    <div class="error-content">
      <h3>Authentication Error</h3>
      <p>Failed to connect to the database. Please try refreshing the page.</p>
      <button @click="retryAuth" class="retry-button">Retry</button>
    </div>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview ConvexProvider Component
 *
 * This component provides Convex client context and handles authentication
 * synchronization between Clerk and Convex. It ensures that the Convex
 * client is properly authenticated before rendering child components.
 *
 * Key responsibilities:
 * - Initialize Convex client with Clerk authentication
 * - Sync user data between Clerk and Convex database
 * - Provide loading state while authentication is being established
 * - Handle authentication token management
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { useConvexClient } from "convex-vue";
import { useUser, useSession } from "@clerk/vue";
import { provide, ref, watch } from "vue";
import { useConvexMutation } from "convex-vue";
import { api } from "../../convex/_generated/api";
import LoadingSpinner from "./LoadingSpinner.vue";

/**
 * Clerk user and session hooks for authentication state management.
 * These hooks provide reactive access to the current user's authentication status.
 */
const { user, isLoaded: clerkIsLoaded } = useUser();
const { session, isLoaded: sessionIsLoaded } = useSession();

/**
 * Loading and error state management for authentication.
 * Child components are only rendered once authentication is successfully established.
 */
const isReady = ref(false);
const authError = ref<Error | null>(null);

/**
 * Convex client instance that provides access to the backend database.
 * This client is automatically provided by convex-vue plugin.
 */
const convex = useConvexClient();

/**
 * Convex mutation hook for creating or getting user data in the database.
 * This mutation is used to sync user profile changes from Clerk to Convex.
 */
const { mutate: storeUser } = useConvexMutation(api.users.store);

/**
 * Updates Convex authentication and syncs user data when Clerk authentication changes.
 *
 * This function performs several critical operations:
 * 1. Sets the Convex auth token from Clerk session
 * 2. Syncs user profile data to Convex database
 * 3. Sets the ready state to allow child components to render
 *
 * The function is called whenever the user or session changes, ensuring
 * that Convex always has the latest authentication state and user data.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // This function is automatically called by the watcher
 * await updateAuth();
 * ```
 */
const updateAuth = async () => {
  // Reset error state on new auth attempt
  authError.value = null;

  // Wait for both Clerk user and session to be loaded before proceeding
  if (!clerkIsLoaded.value || !sessionIsLoaded.value) {
    isReady.value = false; // Explicitly set to false while loading
    return;
  }

  if (user.value && session.value) {
    try {
      // Get Convex-specific JWT token from Clerk session
      const token = await session.value.getToken({ template: "convex" });
      
      if (token) {
        convex.setAuth(async () => token);
        console.log("✅ Convex authentication token set.");
      } else {
        throw new Error("No Convex JWT token received from Clerk session");
      }

      // Sync user to Convex database
      await storeUser({});
      console.log("✅ User synced with Convex successfully.");

      // Authentication is fully established, now we can render children
      isReady.value = true;

    } catch (error) {
      console.error("❌ Error setting up Convex authentication:", error);
      authError.value = error instanceof Error ? error : new Error("Authentication failed");
      isReady.value = false; // Don't render children on auth error
    }
  } else {
    // User is not authenticated - explicitly clear auth state
    convex.setAuth(async () => null);
    isReady.value = true; // Ready to show the "signed-out" state
  }
};

/**
 * Retry authentication after an error occurred.
 * This function is called when the user clicks the retry button.
 */
const retryAuth = () => {
  authError.value = null;
  updateAuth();
};

/**
 * Watcher that monitors changes to Clerk user and session state.
 *
 * This watcher ensures that Convex authentication is updated whenever:
 * - A user signs in or out
 * - User profile data changes
 * - Session tokens are refreshed
 * - Clerk loading states change
 *
 * The immediate: true option ensures the function runs on component mount,
 * establishing authentication state before rendering children.
 */
watch([user, session, clerkIsLoaded, sessionIsLoaded], updateAuth, {
  immediate: true,
});
</script>

<style scoped>
/**
 * Loading styles for Convex connection establishment.
 * This provides visual feedback while the Convex client is being
 * authenticated and connected to the backend.
 */
.convex-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px;
}

/**
 * Error state styles for authentication failures.
 * Provides clear visual feedback and retry option when auth fails.
 */
.auth-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 400px;
  padding: 30px;
  border: 1px solid #dc3545;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.error-content h3 {
  color: #dc3545;
  margin: 0 0 15px 0;
  font-size: 1.2em;
}

.error-content p {
  color: #6c757d;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.retry-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #0056b3;
}
</style>
