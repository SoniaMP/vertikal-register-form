export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMembershipFee } from "@/lib/settings";
import { RegistrationWizard } from "@/components/registration/registration-wizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FederationType } from "@/types";

export const metadata = {
  title: "Alta nueva - Club Vertikal",
  description: "Regístrate como nuevo socio del Club Vertikal",
};

export default async function AltaPage() {
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
    <>
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/registro">
          <ArrowLeft className="mr-2 size-4" />
          Volver atrás
        </Link>
      </Button>
      <Card>
        <CardContent>
          <RegistrationWizard
            federationTypes={federationTypes}
            membershipFee={membershipFee}
          />
        </CardContent>
      </Card>
    </>
  );
}
