"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { licenseSubtypeSchema } from "@/validations/license";
import { requireAuth, type ActionResult } from "@/lib/actions";

export async function createSubtype(
  licenseTypeId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = licenseSubtypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.licenseSubtype.create({
    data: { ...parsed.data, licenseTypeId },
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

  const parsed = licenseSubtypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.licenseSubtype.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function toggleSubtypeActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.licenseSubtype.update({
    where: { id },
    data: { active: isActive },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function deleteSubtype(id: string): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const membershipCount = await prisma.membership.count({
    where: { subtypeId: id },
  });

  if (membershipCount > 0) {
    return {
      success: false,
      error: "No se puede eliminar: tiene membresías asociadas",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.licenseOffering.deleteMany({ where: { subtypeId: id } });
    await tx.licenseSubtype.delete({ where: { id } });
  });

  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}
