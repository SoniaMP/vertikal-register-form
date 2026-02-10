"use client";

import { useState, useTransition } from "react";
import type { FederationSubtype } from "@prisma/client";
import { Pencil, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSubtypeActive } from "@/app/admin/(dashboard)/tipos-federacion/actions";
import { SubtypeFormDialog } from "./subtype-form-dialog";

type Props = {
  subtype: FederationSubtype;
};

export function SubtypeActions({ subtype }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleSubtypeActive(subtype.id, !subtype.active);
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditOpen(true)}
        aria-label="Editar subtipo"
        className="h-7 w-7"
      >
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={subtype.active ? "Desactivar" : "Activar"}
        className="h-7 w-7"
      >
        <Power className="h-3 w-3" />
      </Button>
      <SubtypeFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        federationTypeId={subtype.federationTypeId}
        subtype={subtype}
      />
    </div>
  );
}
