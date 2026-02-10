"use client";

import { useState, useTransition } from "react";
import type { Supplement } from "@prisma/client";
import { Pencil, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSupplementActive } from "@/app/admin/(dashboard)/tipos-federacion/actions";
import { SupplementFormDialog } from "./supplement-form-dialog";

type Props = {
  supplement: Supplement;
};

export function SupplementActions({ supplement }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleSupplementActive(supplement.id, !supplement.active);
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditOpen(true)}
        aria-label="Editar suplemento"
        className="h-7 w-7"
      >
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={supplement.active ? "Desactivar" : "Activar"}
        className="h-7 w-7"
      >
        <Power className="h-3 w-3" />
      </Button>
      <SupplementFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        federationTypeId={supplement.federationTypeId}
        supplement={supplement}
      />
    </div>
  );
}
