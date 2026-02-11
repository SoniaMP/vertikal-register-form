"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRegistrationDialog } from "./create-registration-dialog";
import type { FederationTypeOption } from "./federation-cascading-selects";

type Props = {
  federationTypes: FederationTypeOption[];
};

export function CreateRegistrationButton({ federationTypes }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [generation, setGeneration] = useState(0);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) setGeneration((g) => g + 1);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Nuevo miembro
      </Button>
      <CreateRegistrationDialog
        key={generation}
        open={isOpen}
        onOpenChange={handleOpenChange}
        federationTypes={federationTypes}
      />
    </>
  );
}
