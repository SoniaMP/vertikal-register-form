"use client";

import { useActionState, useEffect } from "react";
import type { Supplement } from "@prisma/client";
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
  createSupplement,
  updateSupplement,
} from "@/app/admin/(dashboard)/tipos-federacion/actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  federationTypeId: string;
  supplement?: Supplement;
};

const INITIAL_STATE = { success: false, error: undefined };

export function SupplementFormDialog({
  open,
  onOpenChange,
  federationTypeId,
  supplement,
}: Props) {
  const isEditing = !!supplement;

  const action = isEditing
    ? updateSupplement.bind(null, supplement.id)
    : createSupplement.bind(null, federationTypeId);

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
            {isEditing ? "Editar suplemento" : "Nuevo suplemento"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sup-name">Nombre</Label>
            <Input
              id="sup-name"
              name="name"
              defaultValue={supplement?.name ?? ""}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sup-description">Descripción</Label>
            <Input
              id="sup-description"
              name="description"
              defaultValue={supplement?.description ?? ""}
              required
              minLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sup-price">Precio (EUR)</Label>
            <Input
              id="sup-price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={
                supplement ? (supplement.price / 100).toFixed(2) : ""
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
