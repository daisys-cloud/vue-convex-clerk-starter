<template>
  <div v-if="isLoading" class="profile-loading">
    <LoadingSpinner size="medium" text="Loading profile..." />
  </div>

  <div v-else-if="error" class="profile-error">
    <p>Error loading profile: {{ error }}</p>
    <button @click="retryLoad" class="retry-button">Retry</button>
  </div>

  <div v-else-if="currentUser" class="profile-content">
    <h2>Welcome, {{ currentUser.name }}!</h2>
    <p>{{ currentUser.email }}</p>
  </div>

  <div v-else class="profile-empty">
    <p>No profile data found.</p>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview UserProfile Component
 *
 * This component displays the current authenticated user's profile information.
 * It automatically fetches user data from the Convex backend and displays
 * the user's name and email address.
 *
 * Key features:
 * - Automatically fetches current user data from Convex
 * - Displays user profile information in a clean format
 * - Handles loading and error states gracefully
 * - User creation is handled by ConvexProvider during auth setup
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { useConvexQuery } from "convex-vue";
import { api } from "../../convex/_generated/api";
import LoadingSpinner from "./LoadingSpinner.vue";

/**
 * Convex query hook for fetching the current user's profile data.
 *
 * This query automatically fetches the authenticated user's profile
 * information from the Convex database. The data is reactive and will
 * automatically update if the user's profile changes.
 *
 * Note: User creation is handled by ConvexProvider during authentication,
 * so we only need to query for the existing user data here.
 */
const {
  data: currentUser,
  error,
  isPending: isLoading,
} = useConvexQuery(api.users.getCurrentUser, {});

/**
 * Retry function for reloading user data when an error occurs.
 *
 * Currently uses page reload as convex-vue@0.1.5 doesn't yet support
 * individual query refetch. Future versions may support more elegant
 * query-specific retry functionality.
 */
const retryLoad = () => {
  window.location.reload(); // Fallback bis refetch() verfügbar ist
};
</script>

<style scoped>
/**
 * Loading state styles for profile data fetching.
 * Provides visual feedback while user profile data is being loaded.
 */
.profile-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 20px;
}

/**
 * Error state styles for profile loading failures.
 * Displays error messages and provides retry functionality.
 */
.profile-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 20px;
  text-align: center;
}

.profile-error p {
  color: #dc3545;
  margin-bottom: 16px;
}

/**
 * Retry button styles for error recovery.
 * Provides a clear call-to-action for users to retry loading their profile.
 */
.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #0056b3;
}

/**
 * Empty state styles for when no profile data is found.
 * Provides feedback when the user exists but has no profile data.
 */
.profile-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 20px;
  text-align: center;
  color: #6c757d;
}

/**
 * Profile content styles for displaying user information.
 * Provides clean, readable layout for user profile data.
 */
.profile-content {
  padding: 20px;
  text-align: center;
}

.profile-content h2 {
  color: #212529;
  margin-bottom: 8px;
}

.profile-content p {
  color: #6c757d;
  margin: 0;
}
</style>
