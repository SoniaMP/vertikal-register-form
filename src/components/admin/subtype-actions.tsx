"use client";

import { useState, useTransition } from "react";
import type { FederationSubtype } from "@prisma/client";
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
  toggleSubtypeActive,
  deleteSubtype,
} from "@/app/admin/(dashboard)/tipos-federacion/actions";
import { SubtypeFormDialog } from "./subtype-form-dialog";

type Props = {
  subtype: FederationSubtype;
  registrationCount: number;
};

export function SubtypeActions({ subtype, registrationCount }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleSubtypeActive(subtype.id, !subtype.active);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteSubtype(subtype.id);
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
        aria-label="Editar subtipo"
        className="h-7 w-7"
      >
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={subtype.active ? "Desactivar" : "Activar"}
        className="h-7 w-7"
      >
        <Power className="h-3 w-3" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isPending || hasRegistrations}
            aria-label="Eliminar subtipo"
            title={
              hasRegistrations
                ? "No se puede eliminar: tiene registros asociados"
                : "Eliminar"
            }
            className="h-7 w-7"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar &ldquo;{subtype.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el subtipo y sus precios
              asociados.
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
      <SubtypeFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        federationTypeId={subtype.federationTypeId}
        subtype={subtype}
      />
    </div>
  );
}
