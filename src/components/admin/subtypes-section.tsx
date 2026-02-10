"use client";

import { useState } from "react";
import type { FederationSubtype } from "@prisma/client";

type SubtypeWithCount = FederationSubtype & {
  _count: { registrations: number };
};
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubtypeActions } from "./subtype-actions";
import { SubtypeFormDialog } from "./subtype-form-dialog";

type Props = {
  federationTypeId: string;
  subtypes: SubtypeWithCount[];
};

export function SubtypesSection({ federationTypeId, subtypes }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="border-t px-4 py-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Subtipos ({subtypes.length})</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {subtypes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Sin subtipos todavía.
            </p>
          )}
          {subtypes.map((sub) => (
            <SubtypeRow key={sub.id} subtype={sub} />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Añadir subtipo
          </Button>
          <SubtypeFormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            federationTypeId={federationTypeId}
          />
        </div>
      )}
    </div>
  );
}

function SubtypeRow({ subtype }: { subtype: SubtypeWithCount }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-medium truncate">{subtype.name}</span>
        <Badge variant={subtype.active ? "default" : "secondary"}>
          {subtype.active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <SubtypeActions
        subtype={subtype}
        registrationCount={subtype._count.registrations}
      />
    </div>
  );
}
