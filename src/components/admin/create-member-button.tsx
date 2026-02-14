"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateMemberDialog } from "./create-member-dialog";
import type { LicenseCatalogType } from "@/types";

type Props = {
  licenseCatalog: LicenseCatalogType[];
};

export function CreateMemberButton({ licenseCatalog }: Props) {
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
      <CreateMemberDialog
        key={generation}
        open={isOpen}
        onOpenChange={handleOpenChange}
        catalog={licenseCatalog}
      />
    </>
  );
}
