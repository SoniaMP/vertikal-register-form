"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { federationSubtypeSchema } from "@/validations/federation-type";
import { requireAuth, type ActionResult } from "./federation-type-actions";

export async function createSubtype(
  federationTypeId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = federationSubtypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.federationSubtype.create({
    data: { ...parsed.data, federationTypeId },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function updateSubtype(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = federationSubtypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.federationSubtype.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function toggleSubtypeActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.federationSubtype.update({
    where: { id },
    data: { active: isActive },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function deleteSubtype(id: string): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const registrationCount = await prisma.registration.count({
    where: { federationSubtypeId: id },
  });

  if (registrationCount > 0) {
    return {
      success: false,
      error: "No se puede eliminar: tiene registros asociados",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.categoryPrice.deleteMany({ where: { subtypeId: id } });
    await tx.federationSubtype.delete({ where: { id } });
  });

  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}
