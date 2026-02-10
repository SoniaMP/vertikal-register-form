"use client";

import { useState, useTransition } from "react";
import type { FederationType } from "@prisma/client";
import { Pencil, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  toggleFederationTypeActive,
  deleteFederationType,
} from "@/app/admin/(dashboard)/tipos-federacion/actions";
import { FederationTypeFormDialog } from "./federation-type-form-dialog";

type Props = {
  federationType: FederationType;
  registrationCount: number;
};

export function FederationTypeActions({
  federationType,
  registrationCount,
}: Props) {
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

  function handleDelete() {
    startTransition(async () => {
      await deleteFederationType(federationType.id);
    });
  }

  const hasRegistrations = registrationCount > 0;

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsEditOpen(true)}
        aria-label="Editar"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={federationType.active ? "Desactivar" : "Activar"}
      >
        <Power className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isPending || hasRegistrations}
            aria-label="Eliminar"
            title={
              hasRegistrations
                ? "No se puede eliminar: tiene registros asociados"
                : "Eliminar"
            }
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar &ldquo;{federationType.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el tipo de federativa y todos
              sus subtipos, categorías, suplementos y grupos de suplementos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FederationTypeFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        federationType={federationType}
      />
    </div>
  );
}
