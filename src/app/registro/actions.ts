"use server";

import { prisma } from "@/lib/prisma";
import { normalizeDni } from "@/helpers/migration-helpers";
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
  typeId: string;
  subtypeId: string;
  categoryId: string;
  supplementIds: string[];
};

export async function findMemberByDni(
  dni: string,
): Promise<RenewalSearchResult | null> {
  if (!SPANISH_DNI_REGEX.test(dni)) {
    return null;
  }

  const member = await prisma.member.findUnique({
    where: { dni: normalizeDni(dni) },
    include: {
      memberships: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { supplements: { select: { supplementId: true } } },
      },
    },
  });

  if (!member) return null;

  const latestMembership = member.memberships[0];

  return {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    dni: member.dni,
    dateOfBirth: member.dateOfBirth,
    address: member.address,
    city: member.city,
    postalCode: member.postalCode,
    province: member.province,
    typeId: latestMembership?.typeId ?? "",
    subtypeId: latestMembership?.subtypeId ?? "",
    categoryId: latestMembership?.categoryId ?? "",
    supplementIds:
      latestMembership?.supplements.map((s) => s.supplementId) ?? [],
  };
}
