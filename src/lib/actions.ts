"use server";

import { auth } from "@/lib/auth";

export type ActionResult = { success: boolean; error?: string };

export async function requireAuth(): Promise<ActionResult | null> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "No autorizado" };
  }
  return null;
}
