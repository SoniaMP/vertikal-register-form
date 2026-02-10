"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  supplementSchema,
  supplementGroupSchema,
} from "@/validations/federation-type";
import { requireAuth, type ActionResult } from "./federation-type-actions";
import { parsePrice } from "./utils";

// --- Supplement actions ---

export async function createSupplement(
  federationTypeId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const groupId = (formData.get("supplementGroupId") as string) || null;
  const price = groupId ? null : parsePrice(formData);

  const parsed = supplementSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price,
    supplementGroupId: groupId,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.supplement.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      supplementGroupId: parsed.data.supplementGroupId,
      federationTypeId,
    },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function updateSupplement(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const groupId = (formData.get("supplementGroupId") as string) || null;
  const price = groupId ? null : parsePrice(formData);

  const parsed = supplementSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price,
    supplementGroupId: groupId,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.supplement.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      supplementGroupId: parsed.data.supplementGroupId,
    },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function toggleSupplementActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.supplement.update({
    where: { id },
    data: { active: isActive },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

// --- Supplement Group actions ---

export async function createSupplementGroup(
  federationTypeId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = supplementGroupSchema.safeParse({
    name: formData.get("name"),
    price: parsePrice(formData),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.supplementGroup.create({
    data: { ...parsed.data, federationTypeId },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function updateSupplementGroup(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = supplementGroupSchema.safeParse({
    name: formData.get("name"),
    price: parsePrice(formData),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.supplementGroup.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function deleteSupplementGroup(
  id: string,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.supplement.updateMany({
    where: { supplementGroupId: id },
    data: { supplementGroupId: null },
  });
  await prisma.supplementGroup.delete({ where: { id } });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}
