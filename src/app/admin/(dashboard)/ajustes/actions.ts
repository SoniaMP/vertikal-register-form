"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  requireAuth,
  type ActionResult,
} from "../tipos-federacion/actions/federation-type-actions";

export async function updateMembershipFee(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await requireAuth();
  if (authError) return authError;

  const rawValue = formData.get("membershipFee");
  const euros = parseFloat(String(rawValue));

  if (!Number.isFinite(euros) || euros < 0) {
    return { success: false, error: "El importe debe ser un número positivo" };
  }

  const cents = Math.round(euros * 100);

  await prisma.appSetting.upsert({
    where: { key: "MEMBERSHIP_FEE" },
    update: { value: String(cents) },
    create: { key: "MEMBERSHIP_FEE", value: String(cents) },
  });

  revalidatePath("/admin/ajustes");
  revalidatePath("/registro");
  return { success: true };
}
