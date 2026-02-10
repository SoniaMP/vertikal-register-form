"use client";

import type {
  FederationType,
  FederationSubtype,
  Supplement,
  Category,
  CategoryPrice,
  SupplementGroup,
} from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FederationTypeActions } from "./federation-type-actions";
import { SubtypesSection } from "./subtypes-section";
import { SupplementsSection } from "./supplements-section";
import { CategoriesSection } from "./categories-section";
import { SupplementGroupsSection } from "./supplement-groups-section";

type SupplementWithGroup = Supplement & {
  supplementGroup: SupplementGroup | null;
};

type CategoryWithPrices = Category & { prices: CategoryPrice[] };

type SupplementGroupWithSupplements = SupplementGroup & {
  supplements: Supplement[];
};

export type FederationTypeWithRelations = FederationType & {
  _count: { supplements: number; registrations: number };
  subtypes: FederationSubtype[];
  supplements: SupplementWithGroup[];
  categories: CategoryWithPrices[];
  supplementGroups: SupplementGroupWithSupplements[];
};

type Props = {
  federationTypes: FederationTypeWithRelations[];
};

export function FederationTypesTable({ federationTypes }: Props) {
  if (federationTypes.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No hay tipos de federativa. Crea el primero.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 md:hidden">
        {federationTypes.map((ft) => (
          <MobileCard key={ft.id} federationType={ft} />
        ))}
      </div>
      <div className="hidden md:block space-y-6">
        {federationTypes.map((ft) => (
          <DesktopRow key={ft.id} federationType={ft} />
        ))}
      </div>
    </div>
  );
}

function DesktopRow({
  federationType: ft,
}: {
  federationType: FederationTypeWithRelations;
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Registros</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{ft.name}</TableCell>
            <TableCell className="text-muted-foreground max-w-48 truncate">
              {ft.description}
            </TableCell>
            <TableCell>
              <Badge variant={ft.active ? "default" : "secondary"}>
                {ft.active ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>{ft._count.registrations}</TableCell>
            <TableCell className="text-right">
              <FederationTypeActions federationType={ft} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <SubtypesSection
        federationTypeId={ft.id}
        subtypes={ft.subtypes}
      />
      <CategoriesSection
        federationTypeId={ft.id}
        categories={ft.categories}
        subtypes={ft.subtypes}
      />
      <SupplementGroupsSection
        federationTypeId={ft.id}
        supplementGroups={ft.supplementGroups}
      />
      <SupplementsSection
        federationTypeId={ft.id}
        supplements={ft.supplements}
        supplementGroups={ft.supplementGroups}
      />
    </div>
  );
}

function MobileCard({
  federationType: ft,
}: {
  federationType: FederationTypeWithRelations;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">{ft.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {ft.description}
          </p>
        </div>
        <Badge variant={ft.active ? "default" : "secondary"}>
          {ft.active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{ft._count.registrations} registros</span>
      </div>
      <FederationTypeActions federationType={ft} />
      <SubtypesSection
        federationTypeId={ft.id}
        subtypes={ft.subtypes}
      />
      <CategoriesSection
        federationTypeId={ft.id}
        categories={ft.categories}
        subtypes={ft.subtypes}
      />
      <SupplementGroupsSection
        federationTypeId={ft.id}
        supplementGroups={ft.supplementGroups}
      />
      <SupplementsSection
        federationTypeId={ft.id}
        supplements={ft.supplements}
        supplementGroups={ft.supplementGroups}
      />
    </div>
  );
}
