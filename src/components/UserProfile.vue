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
 * - Automatically fetches current user data on component mount
 * - Creates or updates user record in Convex database
 * - Displays user profile information in a clean format
 * - Handles loading and error states gracefully
 * - Prevents unnecessary API calls during loading states
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { useConvexQuery, useConvexMutation } from "convex-vue";
import { api } from "../../convex/_generated/api";
import { onMounted, computed } from "vue";
import LoadingSpinner from "./LoadingSpinner.vue";

/**
 * Convex mutation hook for creating or updating user data.
 *
 * This mutation is called when the component mounts to ensure that
 * the current user exists in the Convex database. If the user doesn't
 * exist, it creates a new record; if they do exist, it returns the
 * existing user ID.
 *
 * @type {import('convex-vue').UseConvexMutationReturn}
 */
const { mutate: getOrCreateUser, isPending: isCreatingUser } =
  useConvexMutation(api.users.getOrCreateUser);

/**
 * Convex query hook for fetching the current user's profile data.
 *
 * This query automatically fetches the authenticated user's profile
 * information from the Convex database. The data is reactive and will
 * automatically update if the user's profile changes.
 *
 * @type {import('convex-vue').UseConvexQueryReturn}
 */
const {
  data: currentUser,
  error,
  isPending: isFetchingUser,
  suspense,
} = useConvexQuery(api.users.getCurrentUser, {});

/**
 * Computed property that determines if the component is in a loading state.
 *
 * This prevents rendering the profile content while data is being fetched
 * or while the user record is being created/updated.
 */
const isLoading = computed(() => isFetchingUser.value || isCreatingUser.value);

/**
 * Retry function for reloading user data when an error occurs.
 *
 * This function can be called by the user to retry loading their profile
 * data if there was an error during the initial load.
 *
 * @async
 * @returns {Promise<void>}
 */
const retryLoad = async () => {
  try {
    await getOrCreateUser({});
  } catch (error) {
    console.error("Error retrying user load:", error);
  }
};

/**
 * Lifecycle hook that runs when the component is mounted.
 *
 * This function ensures that the current user exists in the Convex
 * database by calling the getOrCreateUser mutation. This is necessary
 * because users might authenticate with Clerk but not yet have a
 * corresponding record in the Convex database.
 *
 * The function is only called once when the component mounts, preventing
 * unnecessary API calls during re-renders.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * onMounted(async () => {
 *   await getOrCreateUser({});
 * });
 * ```
 */
onMounted(async () => {
  try {
    await getOrCreateUser({});
  } catch (error) {
    console.error("Error creating/updating user:", error);
  }
});
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
