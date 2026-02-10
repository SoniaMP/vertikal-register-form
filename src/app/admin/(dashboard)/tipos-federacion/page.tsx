import { prisma } from "@/lib/prisma";
import { FederationTypesTable } from "@/components/admin/federation-types-table";
import { CreateFederationTypeButton } from "@/components/admin/create-federation-type-button";

export default async function FederationTypesPage() {
  const federationTypes = await prisma.federationType.findMany({
    include: {
      _count: { select: { supplements: true, registrations: true } },
      subtypes: { orderBy: { createdAt: "asc" } },
      supplements: {
        orderBy: { createdAt: "asc" },
        include: { supplementGroup: true },
      },
      categories: {
        orderBy: { createdAt: "asc" },
        include: { prices: true },
      },
      supplementGroups: {
        orderBy: { createdAt: "asc" },
        include: { supplements: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión federativas deportivas</h1>
        <CreateFederationTypeButton />
      </div>
      <FederationTypesTable federationTypes={federationTypes} />
    </div>
  );
}
