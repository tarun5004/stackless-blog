/**
 * NextAuth API Route Handler — /api/auth/[...nextauth]
 *
 * This is the single API endpoint that handles all NextAuth flows:
 * - GET  /api/auth/signin     → Initiates GitHub OAuth flow
 * - GET  /api/auth/callback   → GitHub redirects back here
 * - GET  /api/auth/signout    → Clears session
 * - GET  /api/auth/session    → Returns current session (JSON)
 *
 * The actual auth logic is in src/lib/auth.ts.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
