/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CONVEX_URL: string;
  readonly CONVEX_DEPLOYMENT: string;
  readonly CLERK_JWT_ISSUER_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
