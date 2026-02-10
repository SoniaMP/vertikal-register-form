"use client";

import { useState } from "react";
import type {
  FederationType,
  FederationSubtype,
  Supplement,
  Category,
  CategoryPrice,
  SupplementGroup,
} from "@prisma/client";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FederationTypeActions } from "./federation-type-actions";
import { DetailSections } from "./federation-type-detail-sections";

type SupplementWithGroup = Supplement & {
  supplementGroup: SupplementGroup | null;
};

type SubtypeWithCount = FederationSubtype & {
  _count: { registrations: number };
};

type CategoryWithPrices = Category & {
  prices: CategoryPrice[];
  _count: { registrations: number };
};

type SupplementGroupWithSupplements = SupplementGroup & {
  supplements: Supplement[];
};

export type FederationTypeWithRelations = FederationType & {
  _count: { supplements: number; registrations: number };
  subtypes: SubtypeWithCount[];
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 align-middle" />
              <TableHead className="align-middle">Nombre</TableHead>
              <TableHead className="align-middle">Descripción</TableHead>
              <TableHead className="align-middle">Estado</TableHead>
              <TableHead className="align-middle">Registros</TableHead>
              <TableHead className="text-right align-middle">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="align-middle">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-muted"
                    aria-label={isOpen ? "Colapsar" : "Expandir"}
                  >
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </TableCell>
              <TableCell className="font-medium align-middle">{ft.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-48 truncate align-middle">
                {ft.description}
              </TableCell>
              <TableCell className="align-middle">
                <Badge variant={ft.active ? "default" : "secondary"}>
                  {ft.active ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="align-middle">{ft._count.registrations}</TableCell>
              <TableCell className="align-middle">
                <div className="flex justify-end">
                  <FederationTypeActions
                    federationType={ft}
                    registrationCount={ft._count.registrations}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CollapsibleContent>
          <DetailSections federationType={ft} />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function MobileCard({
  federationType: ft,
}: {
  federationType: FederationTypeWithRelations;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 min-w-0"
              aria-label={isOpen ? "Colapsar" : "Expandir"}
            >
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              <div className="min-w-0 text-left">
                <p className="font-medium">{ft.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {ft.description}
                </p>
              </div>
            </button>
          </CollapsibleTrigger>
          <Badge variant={ft.active ? "default" : "secondary"}>
            {ft.active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{ft._count.registrations} registros</span>
        </div>
        <FederationTypeActions
          federationType={ft}
          registrationCount={ft._count.registrations}
        />
        <CollapsibleContent>
          <DetailSections federationType={ft} />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

