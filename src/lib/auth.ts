import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { authConfig } from "./auth.config";

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { roles: { include: { role: true } } },
        });

        const passwordHash = await sha256(password);
        if (!user || passwordHash !== user.passwordHash) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
});
