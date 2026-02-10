"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/admin/(dashboard)/tipos-federacion/actions/federation-type-actions";
import { personalDataSchema } from "@/validations/registration";

type ActionResult = { success: boolean; error?: string };

const paymentStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);

const updateRegistrationSchema = personalDataSchema.extend({
  paymentStatus: paymentStatusSchema,
});

export async function updateRegistration(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const parsed = updateRegistrationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dni: formData.get("dni"),
    dateOfBirth: formData.get("dateOfBirth"),
    address: formData.get("address"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    province: formData.get("province"),
    paymentStatus: formData.get("paymentStatus"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
    return { success: false, error: firstError };
  }

  await prisma.registration.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleRegistrationActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.registration.update({
    where: { id },
    data: { active: isActive },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function toggleRegistrationFederated(
  id: string,
  isFederated: boolean,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  await prisma.registration.update({
    where: { id },
    data: { isFederated },
  });

  revalidatePath("/admin");
  return { success: true };
}

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
