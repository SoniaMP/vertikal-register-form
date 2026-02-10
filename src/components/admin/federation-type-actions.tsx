"use client";

import { useState, useTransition } from "react";
import type { FederationType } from "@prisma/client";
import { Pencil, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFederationTypeActive } from "@/app/admin/(dashboard)/tipos-federacion/actions";
import { FederationTypeFormDialog } from "./federation-type-form-dialog";

type Props = {
  federationType: FederationType;
};

export function FederationTypeActions({ federationType }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleFederationTypeActive(
        federationType.id,
        !federationType.active,
      );
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditOpen(true)}
        aria-label="Editar"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={federationType.active ? "Desactivar" : "Activar"}
      >
        <Power className="h-4 w-4" />
      </Button>
      <FederationTypeFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        federationType={federationType}
      />
    </div>
  );
}
