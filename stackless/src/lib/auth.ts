/**
 * NextAuth v5 configuration — GitHub OAuth for admin access.
 *
 * Only the GitHub account whose numeric ID matches ADMIN_GITHUB_ID
 * is allowed to sign in. All other GitHub users are rejected.
 *
 * Sessions use HTTP-only cookies (JWT strategy) — no database needed.
 */

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    /**
     * Only allow the designated admin GitHub account to sign in.
     * The ADMIN_GITHUB_ID env var holds the numeric GitHub user ID.
     */
    async signIn({ profile }) {
      const adminId = process.env.ADMIN_GITHUB_ID;
      if (!adminId) {
        console.error("ADMIN_GITHUB_ID not set — blocking all sign-ins");
        return false;
      }
      return String(profile?.id) === adminId;
    },

    /** Attach GitHub profile info to the JWT */
    async jwt({ token, profile }) {
      if (profile) {
        token.githubId = String(profile.id);
        token.githubLogin = profile.login as string;
      }
      return token;
    },

    /** Expose GitHub info in the session object */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.githubId as string;
        session.user.name = token.githubLogin as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days as per spec
  },
});
