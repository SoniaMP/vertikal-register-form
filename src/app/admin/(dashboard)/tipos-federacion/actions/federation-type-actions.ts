"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { federationTypeSchema } from "@/validations/federation-type";

export type ActionResult = { success: boolean; error?: string };

export async function requireAuth(): Promise<ActionResult | null> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "No autorizado" };
  }
  return null;
}

export async function createFederationType(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = federationTypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.federationType.create({ data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function updateFederationType(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = federationTypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.federationType.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function toggleFederationTypeActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.federationType.update({
    where: { id },
    data: { active: isActive },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function deleteFederationType(
  id: string,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const registrationCount = await prisma.registration.count({
    where: { federationTypeId: id },
  });

  if (registrationCount > 0) {
    return {
      success: false,
      error: "No se puede eliminar: tiene registros asociados",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.categoryPrice.deleteMany({
      where: { category: { federationTypeId: id } },
    });
    await tx.category.deleteMany({ where: { federationTypeId: id } });
    await tx.supplement.deleteMany({ where: { federationTypeId: id } });
    await tx.supplementGroup.deleteMany({ where: { federationTypeId: id } });
    await tx.federationSubtype.deleteMany({ where: { federationTypeId: id } });
    await tx.federationType.delete({ where: { id } });
  });

  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}
