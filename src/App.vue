<template>
  <div>
    <!-- Show loading state while Clerk is determining authentication -->
    <div v-if="!isLoaded" class="loading-container">
      <LoadingSpinner size="large" text="Initializing..." />
    </div>

    <!-- Show app content once authentication state is determined -->
    <div v-else>
      <header>
        <h1>My App</h1>
        <UserButton v-if="user" />
        <SignInButton v-else />
      </header>

      <main>
        <ConvexProvider v-if="user">
          <nav class="main-nav">
            <button 
              @click="activeView = 'profile'" 
              :class="{ active: activeView === 'profile' }"
              class="nav-btn"
            >
              Profile
            </button>
            <button 
              @click="activeView = 'notes'" 
              :class="{ active: activeView === 'notes' }"
              class="nav-btn"
            >
              Notes
            </button>
          </nav>
          
          <div class="content">
            <UserProfile v-if="activeView === 'profile'" />
            <NotesList v-if="activeView === 'notes'" />
          </div>
        </ConvexProvider>
        <p v-else>Please sign in</p>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview Main Application Component
 *
 * This is the root component of the Vue + Convex + Clerk authentication application.
 * It provides the main application structure and handles the authentication flow
 * between different components.
 *
 * Key responsibilities:
 * - Render the main application layout with header and main content
 * - Conditionally render authentication components based on user state
 * - Provide the entry point for the entire application
 * - Manage the overall user experience flow
 * - Handle loading states to prevent authentication UI flashing
 *
 * Component structure:
 * - Loading state while authentication is being determined
 * - Header with app title and authentication buttons
 * - Main content area with conditional rendering based on auth state
 * - ConvexProvider wrapper for authenticated users
 * - UserProfile display for authenticated users
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

import { ref } from 'vue'
import { SignInButton, UserButton, useUser } from "@clerk/vue";
import ConvexProvider from "./components/ConvexProvider.vue";
import UserProfile from "./components/UserProfile.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import NotesList from "./components/NotesList.vue";

// Active view state
const activeView = ref<'profile' | 'notes'>('notes')

/**
 * Clerk authentication hook for accessing the current user state.
 *
 * This hook provides reactive access to the current user's authentication
 * status. The user object will be null when no user is signed in, and
 * will contain user data when a user is authenticated.
 *
 * The isLoaded property indicates whether Clerk has finished determining
 * the authentication state, preventing UI flashing during page refresh.
 *
 * @type {import('@clerk/vue').UseUserReturn}
 */
const { user, isLoaded } = useUser();
</script>

<style scoped>
/**
 * Loading container styles for authentication state determination.
 * This provides a clean, centered loading experience while Clerk
 * determines whether the user is authenticated or not.
 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 0;
}

header h1 {
  margin: 0;
  color: #333;
}

.main-nav {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.nav-btn {
  padding: 10px 20px;
  border: none;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #e9ecef;
}

.nav-btn.active {
  background: #007bff;
  color: white;
}

.content {
  min-height: calc(100vh - 200px);
}
</style>
