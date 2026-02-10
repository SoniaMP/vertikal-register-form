"use client";

import { useActionState, useEffect } from "react";
import type { SupplementGroup } from "@prisma/client";
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
  createSupplementGroup,
  updateSupplementGroup,
} from "@/app/admin/(dashboard)/tipos-federacion/actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  federationTypeId: string;
  group?: SupplementGroup;
};

const INITIAL_STATE = { success: false, error: undefined };

export function SupplementGroupFormDialog({
  open,
  onOpenChange,
  federationTypeId,
  group,
}: Props) {
  const isEditing = !!group;

  const action = isEditing
    ? updateSupplementGroup.bind(null, group.id)
    : createSupplementGroup.bind(null, federationTypeId);

  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar grupo" : "Nuevo grupo de suplementos"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grp-name">Nombre</Label>
            <Input
              id="grp-name"
              name="name"
              defaultValue={group?.name ?? ""}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grp-price">Precio del grupo (EUR)</Label>
            <Input
              id="grp-price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={group ? (group.price / 100).toFixed(2) : ""}
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
