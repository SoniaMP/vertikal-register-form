import { prisma } from "@/lib/prisma";
import { RegistrationWizard } from "@/components/registration/registration-wizard";
import type { FederationType } from "@/types";

export const metadata = {
  title: "Registro - Vertikal Club",
  description: "Regístrate como socio del Vertikal Club",
};

export default async function RegistroPage() {
  const federationTypes = (await prisma.federationType.findMany({
    where: { active: true },
    include: {
      supplements: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { price: "asc" },
  })) as FederationType[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Registro de socio</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Completa el formulario para registrarte en el Vertikal Club
        </p>
      </div>
      <RegistrationWizard federationTypes={federationTypes} />
    </div>
  );
}
