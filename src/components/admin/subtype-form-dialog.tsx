"use client";

import { useActionState, useEffect } from "react";
import type { FederationSubtype } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSubtype,
  updateSubtype,
} from "@/app/admin/(dashboard)/tipos-federacion/actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  federationTypeId: string;
  subtype?: FederationSubtype;
};

const INITIAL_STATE = { success: false, error: undefined };

export function SubtypeFormDialog({
  open,
  onOpenChange,
  federationTypeId,
  subtype,
}: Props) {
  const isEditing = !!subtype;

  const action = isEditing
    ? updateSubtype.bind(null, subtype.id)
    : createSubtype.bind(null, federationTypeId);

  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar subtipo" : "Nuevo subtipo"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sub-name">Nombre</Label>
            <Input
              id="sub-name"
              name="name"
              defaultValue={subtype?.name ?? ""}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-description">Descripción</Label>
            <Input
              id="sub-description"
              name="description"
              defaultValue={subtype?.description ?? ""}
              required
              minLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-price">Precio (EUR)</Label>
            <Input
              id="sub-price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={
                subtype ? (subtype.price / 100).toFixed(2) : ""
              }
              required
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
