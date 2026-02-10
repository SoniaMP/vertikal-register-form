"use client";

import { useState, useTransition } from "react";
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
  toggleRegistrationActive,
  deleteRegistration,
} from "@/app/admin/(dashboard)/registros/actions";
import {
  RegistrationFormDialog,
  type RegistrationFormData,
} from "./registration-form-dialog";

type Props = {
  registration: RegistrationFormData & { active: boolean };
};

export function RegistrationActions({ registration }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleRegistrationActive(registration.id, !registration.active);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteRegistration(registration.id);
    });
  }

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
        aria-label={registration.active ? "Desactivar" : "Activar"}
      >
        <Power className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isPending}
            aria-label="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar a &ldquo;{registration.firstName}{" "}
              {registration.lastName}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro del miembro y
              todos sus datos asociados.
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
      <RegistrationFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        registration={registration}
      />
    </div>
  );
}
