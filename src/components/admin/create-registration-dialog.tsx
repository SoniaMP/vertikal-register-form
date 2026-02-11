"use client";

import { useActionState, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegistrationFormFields } from "./registration-form-fields";
import {
  FederationCascadingSelects,
  type FederationTypeOption,
} from "./federation-cascading-selects";
import {
  createRegistration,
  searchByDni,
  type DniSearchResult,
} from "@/app/admin/(dashboard)/registros/actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  federationTypes: FederationTypeOption[];
};

const INITIAL_STATE = { success: false, error: undefined };

export function CreateRegistrationDialog({
  open,
  onOpenChange,
  federationTypes,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    createRegistration,
    INITIAL_STATE,
  );
  const [dniQuery, setDniQuery] = useState("");
  const [prefill, setPrefill] = useState<NonNullable<DniSearchResult>>();
  const [isSearching, setIsSearching] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  async function handleDniSearch() {
    if (!dniQuery.trim()) return;
    setIsSearching(true);
    const result = await searchByDni(dniQuery.trim());
    if (result) {
      setPrefill(result);
      setFormKey((k) => k + 1);
    }
    setIsSearching(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo miembro</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Buscar por DNI..."
            value={dniQuery}
            onChange={(e) => setDniQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDniSearch()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDniSearch}
            disabled={isSearching}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <form action={formAction} className="space-y-4" key={formKey}>
          <RegistrationFormFields registration={prefill} />

          <FederationCascadingSelects
            federationTypes={federationTypes}
            defaultTypeId={prefill?.federationTypeId}
            defaultSubtypeId={prefill?.federationSubtypeId}
            defaultCategoryId={prefill?.categoryId}
          />

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
              {isPending ? "Creando..." : "Crear miembro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
