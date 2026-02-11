"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { licenseTypeSchema } from "@/validations/license";
import { requireAuth, type ActionResult } from "@/lib/actions";

export async function createLicenseType(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = licenseTypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.licenseType.create({ data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function updateLicenseType(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = licenseTypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.licenseType.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function toggleLicenseTypeActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.licenseType.update({
    where: { id },
    data: { active: isActive },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function deleteLicenseType(
  id: string,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const membershipCount = await prisma.membership.count({
    where: { typeId: id },
  });

  if (membershipCount > 0) {
    return {
      success: false,
      error: "No se puede eliminar: tiene membresías asociadas",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.licenseOffering.deleteMany({ where: { typeId: id } });
    await tx.licenseSubtype.deleteMany({ where: { licenseTypeId: id } });
    await tx.licenseType.delete({ where: { id } });
  });

  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}
