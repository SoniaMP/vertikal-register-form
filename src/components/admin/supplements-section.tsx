"use client";

import { useState } from "react";
import type { Supplement, SupplementGroup } from "@prisma/client";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/helpers/price-calculator";
import { SupplementActions } from "./supplement-actions";
import { SupplementFormDialog } from "./supplement-form-dialog";

type SupplementWithGroup = Supplement & {
  supplementGroup: SupplementGroup | null;
};

type SupplementGroupWithSupplements = SupplementGroup & {
  supplements: Supplement[];
};

type Props = {
  federationTypeId: string;
  supplements: SupplementWithGroup[];
  supplementGroups: SupplementGroupWithSupplements[];
};

export function SupplementsSection({
  federationTypeId,
  supplements,
  supplementGroups,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="border-t px-4 py-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Suplementos ({supplements.length})</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {supplements.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Sin suplementos todavía.
            </p>
          )}
          {supplements.map((sup) => (
            <SupplementRow
              key={sup.id}
              supplement={sup}
              supplementGroups={supplementGroups}
              federationTypeId={federationTypeId}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Añadir suplemento
          </Button>
          <SupplementFormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            federationTypeId={federationTypeId}
            supplementGroups={supplementGroups}
          />
        </div>
      )}
    </div>
  );
}

function SupplementRow({
  supplement,
  supplementGroups,
  federationTypeId,
}: {
  supplement: SupplementWithGroup;
  supplementGroups: SupplementGroupWithSupplements[];
  federationTypeId: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-medium truncate">{supplement.name}</span>
        {supplement.supplementGroup ? (
          <Badge variant="outline">
            Grupo: {supplement.supplementGroup.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">
            {supplement.price !== null ? formatPrice(supplement.price) : "—"}
          </span>
        )}
        <Badge variant={supplement.active ? "default" : "secondary"}>
          {supplement.active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <SupplementActions
        supplement={supplement}
        supplementGroups={supplementGroups}
        federationTypeId={federationTypeId}
      />
    </div>
  );
}
