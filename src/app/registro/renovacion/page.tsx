export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getMembershipFee } from "@/lib/settings";
import { RenewalFlow } from "@/components/registration/renewal-flow";
import type { FederationType } from "@/types";

export const metadata = {
  title: "Renovación - Club Vertikal",
  description: "Renueva tu registro de socio en el Club Vertikal",
};

export default async function RenovacionPage() {
  const federationTypes = (await prisma.federationType.findMany({
    where: { active: true },
    include: {
      subtypes: {
        where: { active: true },
        orderBy: { createdAt: "asc" },
      },
      supplements: {
        where: { active: true },
        include: { supplementGroup: true },
        orderBy: { name: "asc" },
      },
      categories: {
        where: { active: true },
        include: { prices: true },
        orderBy: { createdAt: "asc" },
      },
      supplementGroups: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  })) as FederationType[];

  const membershipFee = await getMembershipFee();

  return (
    <RenewalFlow
      federationTypes={federationTypes}
      membershipFee={membershipFee}
    />
  );
}
