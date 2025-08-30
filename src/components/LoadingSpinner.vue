<template>
  <div class="loading-spinner-container" :class="sizeClass">
    <div class="loading-spinner" :class="[sizeClass, colorClass]"></div>
    <p v-if="showText" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * @fileoverview LoadingSpinner Component
 *
 * A reusable loading spinner component that provides consistent
 * loading states throughout the application. Supports different
 * sizes and colors for various use cases.
 *
 * Key features:
 * - Multiple size options (small, medium, large)
 * - Color variants for different contexts
 * - Optional loading text
 * - Consistent styling across the application
 * - Accessible loading indicators
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 */

/**
 * Component props for customizing the loading spinner.
 *
 * @prop {string} size - The size of the spinner (small, medium, large)
 * @prop {string} color - The color variant of the spinner (primary, success, warning, danger)
 * @prop {string} text - Optional text to display below the spinner
 * @prop {boolean} showText - Whether to display the loading text
 */
interface Props {
  size?: "small" | "medium" | "large";
  color?: "primary" | "success" | "warning" | "danger";
  text?: string;
  showText?: boolean;
}

/**
 * Default prop values for the loading spinner.
 */
const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  color: "primary",
  text: "Loading...",
  showText: true,
});

/**
 * Computed CSS class for the spinner size.
 * Maps the size prop to appropriate CSS classes.
 */
const sizeClass = computed(() => `spinner-${props.size}`);

/**
 * Computed CSS class for the spinner color.
 * Maps the color prop to appropriate CSS classes.
 */
const colorClass = computed(() => `spinner-${props.color}`);
</script>

<style scoped>
/**
 * Base container styles for the loading spinner.
 * Provides consistent layout and spacing for all spinner variants.
 */
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/**
 * Base spinner styles with smooth animation.
 * Uses CSS transforms and transitions for optimal performance.
 */
.loading-spinner {
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

/**
 * Small spinner variant (24px).
 * Used for inline loading states and small components.
 */
.spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid #e9ecef;
}

/**
 * Medium spinner variant (32px).
 * Default size used in most loading scenarios.
 */
.spinner-medium {
  width: 32px;
  height: 32px;
  border: 3px solid #e9ecef;
}

/**
 * Large spinner variant (48px).
 * Used for full-page loading states and prominent loading indicators.
 */
.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid #e9ecef;
}

/**
 * Primary color variant (blue).
 * Default color for general loading states.
 */
.spinner-primary {
  border-top-color: #007bff;
}

/**
 * Success color variant (green).
 * Used for successful operations and positive feedback.
 */
.spinner-success {
  border-top-color: #28a745;
}

/**
 * Warning color variant (yellow).
 * Used for warning states and caution indicators.
 */
.spinner-warning {
  border-top-color: #ffc107;
}

/**
 * Danger color variant (red).
 * Used for error states and critical operations.
 */
.spinner-danger {
  border-top-color: #dc3545;
}

/**
 * Loading text styles.
 * Provides clear, readable text below the spinner.
 */
.loading-text {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

/**
 * Small text variant for compact layouts.
 */
.spinner-small .loading-text {
  font-size: 12px;
}

/**
 * Large text variant for prominent loading states.
 */
.spinner-large .loading-text {
  font-size: 16px;
}

/**
 * Spinning animation keyframes.
 * Creates smooth rotation animation for the spinner.
 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/**
 * Hover effects for interactive loading states.
 * Provides subtle visual feedback on hover.
 */
.loading-spinner:hover {
  filter: brightness(1.1);
}

/**
 * Reduced motion support for accessibility.
 * Respects user preferences for reduced motion.
 */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}
</style>

