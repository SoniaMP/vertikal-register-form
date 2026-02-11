"use client";

import { useState } from "react";
import type {
  LicenseType,
  LicenseSubtype,
  LicenseOffering,
  Category,
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
import { LicenseTypeActions } from "./license-type-actions-menu";
import { DetailSections } from "./license-type-detail-sections";
import { TruncatedCell } from "./truncated-cell";

export type SubtypeWithCount = LicenseSubtype & {
  _count: { memberships: number };
};

export type CategoryWithCount = Category & {
  _count: { memberships: number };
};

export type LicenseTypeWithRelations = LicenseType & {
  _count: { memberships: number };
  subtypes: SubtypeWithCount[];
  offerings: LicenseOffering[];
};

type Props = {
  licenseTypes: LicenseTypeWithRelations[];
  categories: CategoryWithCount[];
  seasonId: string;
};

export function LicenseTypesTable({
  licenseTypes,
  categories,
  seasonId,
}: Props) {
  if (licenseTypes.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No hay tipos de federativa. Crea el primero.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 md:hidden">
        {licenseTypes.map((lt) => (
          <MobileCard
            key={lt.id}
            licenseType={lt}
            categories={categories}
            seasonId={seasonId}
          />
        ))}
      </div>
      <div className="hidden md:block space-y-6">
        {licenseTypes.map((lt) => (
          <DesktopRow
            key={lt.id}
            licenseType={lt}
            categories={categories}
            seasonId={seasonId}
          />
        ))}
      </div>
    </div>
  );
}

type RowProps = {
  licenseType: LicenseTypeWithRelations;
  categories: CategoryWithCount[];
  seasonId: string;
};

function DesktopRow({ licenseType: lt, categories, seasonId }: RowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 align-middle" />
              <TableHead className="w-48 align-middle">Nombre</TableHead>
              <TableHead className="w-64 align-middle">Descripción</TableHead>
              <TableHead className="align-middle">Estado</TableHead>
              <TableHead className="align-middle">Registros</TableHead>
              <TableHead className="text-right align-middle">
                Acciones
              </TableHead>
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
              <TableCell className="w-48 align-middle">
                <TruncatedCell
                  text={lt.name}
                  className="font-medium max-w-48"
                />
              </TableCell>
              <TableCell className="w-64 align-middle">
                <TruncatedCell
                  text={lt.description}
                  className="text-muted-foreground max-w-64"
                />
              </TableCell>
              <TableCell className="align-middle">
                <Badge variant={lt.active ? "default" : "secondary"}>
                  {lt.active ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="align-middle">
                {lt._count.memberships}
              </TableCell>
              <TableCell className="align-middle">
                <div className="flex justify-end">
                  <LicenseTypeActions
                    licenseType={lt}
                    membershipCount={lt._count.memberships}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CollapsibleContent>
          <DetailSections
            licenseType={lt}
            categories={categories}
            seasonId={seasonId}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function MobileCard({ licenseType: lt, categories, seasonId }: RowProps) {
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
                <p className="font-medium">{lt.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {lt.description}
                </p>
              </div>
            </button>
          </CollapsibleTrigger>
          <Badge variant={lt.active ? "default" : "secondary"}>
            {lt.active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{lt._count.memberships} registros</span>
        </div>
        <LicenseTypeActions
          licenseType={lt}
          membershipCount={lt._count.memberships}
        />
        <CollapsibleContent>
          <DetailSections
            licenseType={lt}
            categories={categories}
            seasonId={seasonId}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
