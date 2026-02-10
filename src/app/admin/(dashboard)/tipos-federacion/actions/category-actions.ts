"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  categorySchema,
  categoryPriceSchema,
} from "@/validations/federation-type";
import { requireAuth, type ActionResult } from "./federation-type-actions";
import { parsePrice } from "./utils";

const batchPriceSchema = z.array(
  z.object({
    categoryId: z.string().min(1),
    subtypeId: z.string().min(1),
    price: z.number().int().positive().nullable(),
  }),
);

export async function createCategory(
  federationTypeId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.category.create({
    data: { ...parsed.data, federationTypeId },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function updateCategory(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function toggleCategoryActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.category.update({
    where: { id },
    data: { active: isActive },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function batchUpsertCategoryPrices(
  entries: { categoryId: string; subtypeId: string; price: number | null }[],
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = batchPriceSchema.safeParse(entries);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  const toUpsert = parsed.data.filter(
    (e): e is (typeof e) & { price: number } => e.price !== null,
  );
  const toDelete = parsed.data.filter((e) => e.price === null);

  await prisma.$transaction([
    ...toUpsert.map(({ categoryId, subtypeId, price }) =>
      prisma.categoryPrice.upsert({
        where: { categoryId_subtypeId: { categoryId, subtypeId } },
        create: { categoryId, subtypeId, price },
        update: { price },
      }),
    ),
    ...toDelete.map(({ categoryId, subtypeId }) =>
      prisma.categoryPrice.deleteMany({
        where: { categoryId, subtypeId },
      }),
    ),
  ]);

  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}

export async function upsertCategoryPrice(
  categoryId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const subtypeId = formData.get("subtypeId") as string;
  const price = parsePrice(formData);

  const parsed = categoryPriceSchema.safeParse({ subtypeId, price });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.categoryPrice.upsert({
    where: { categoryId_subtypeId: { categoryId, subtypeId } },
    create: { categoryId, subtypeId, price },
    update: { price },
  });
  revalidatePath("/admin/tipos-federacion");
  return { success: true };
}
