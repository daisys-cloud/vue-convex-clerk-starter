/**
 * @fileoverview Convex Authentication Configuration
 *
 * This file configures how Convex handles authentication with Clerk.
 * It sets up the JWT provider configuration to validate Clerk authentication
 * tokens and establish secure connections between the frontend and backend.
 *
 * Key configuration:
 * - JWT issuer domain from Clerk environment variables
 * - Application ID for Convex backend identification
 * - Secure token validation for authenticated requests
 *
 * Environment variables required:
 * - CLERK_JWT_ISSUER_DOMAIN: Clerk's JWT issuer domain for token validation
 *
 * @author Vue + Convex + Clerk Auth System
 * @version 1.0.0
 * @see https://docs.convex.dev/auth
 */

export default {
  /**
   * Authentication providers configuration.
   *
   * This array defines the authentication methods that Convex will accept.
   * Currently configured to use Clerk's JWT-based authentication system.
   */
  providers: [
    {
      /**
       * JWT issuer domain for Clerk authentication.
       *
       * This domain is used to validate JWT tokens issued by Clerk.
       * The domain must match the issuer claim in Clerk's JWT tokens.
       */
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,

      /**
       * Application identifier for Convex.
       *
       * This ID uniquely identifies this Convex backend to Clerk.
       * It's used in the JWT token template configuration in Clerk.
       */
      applicationID: "convex",
    },
  ],
};
