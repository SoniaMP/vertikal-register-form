"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FederationTypeFormDialog } from "./federation-type-form-dialog";

export function CreateFederationTypeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Nuevo tipo
      </Button>
      <FederationTypeFormDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
