"use server";

import { prisma } from "@/lib/prisma";
import { SPANISH_DNI_REGEX } from "@/validations/registration";

export type RenewalSearchResult = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  federationTypeId: string;
  federationSubtypeId: string;
  categoryId: string;
  supplementIds: string[];
};

export async function findRegistrationByDni(
  dni: string,
): Promise<RenewalSearchResult | null> {
  if (!SPANISH_DNI_REGEX.test(dni)) {
    return null;
  }

  const registration = await prisma.registration.findFirst({
    where: {
      OR: [{ dni: dni.toUpperCase() }, { dni: dni.toLowerCase() }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dni: true,
      dateOfBirth: true,
      address: true,
      city: true,
      postalCode: true,
      province: true,
      federationTypeId: true,
      federationSubtypeId: true,
      categoryId: true,
      supplements: { select: { supplementId: true } },
    },
  });

  if (!registration) return null;

  return {
    ...registration,
    supplements: undefined,
    supplementIds: registration.supplements.map((s) => s.supplementId),
  } as RenewalSearchResult;
}
