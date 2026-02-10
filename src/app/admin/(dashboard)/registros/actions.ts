"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/admin/(dashboard)/tipos-federacion/actions/federation-type-actions";

type ActionResult = { success: boolean; error?: string };

export async function deleteRegistration(id: string): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const registration = await prisma.registration.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!registration) {
    return { success: false, error: "Registro no encontrado" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.registrationSupplement.deleteMany({
      where: { registrationId: id },
    });
    await tx.registration.delete({ where: { id } });
  });

  revalidatePath("/admin");
  return { success: true };
}
