import type { NextAuthConfig } from "next-auth";

// Edge-compatible config — no Node.js modules (no Prisma, no fs).
// Used by the middleware to validate JWT sessions.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
} satisfies NextAuthConfig;
