export const dynamic = "force-dynamic";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getMembershipFee } from "@/lib/settings";
import { RegistrationWizard } from "@/components/registration/registration-wizard";
import { Card, CardContent } from "@/components/ui/card";
import type { FederationType } from "@/types";

export const metadata = {
  title: "Registro - Club Vertikal",
  description: "Regístrate como socio del Club Vertikal",
};

export default async function RegistroPage() {
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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <Image
          src="/logo-horizontal-color.png"
          alt="Club Vertikal"
          width={200}
          height={40}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-2xl font-bold sm:text-3xl">Registro de socio</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Completa el formulario para registrarte en el Club Vertikal
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <RegistrationWizard federationTypes={federationTypes} membershipFee={membershipFee} />
        </CardContent>
      </Card>
    </div>
  );
}
