"use client";

import { useState, useTransition } from "react";
import type { Category } from "@prisma/client";
import { Pencil, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleCategoryActive } from "@/app/admin/(dashboard)/tipos-federacion/actions";
import { CategoryFormDialog } from "./category-form-dialog";

type Props = {
  category: Category;
};

export function CategoryActions({ category }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCategoryActive(category.id, !category.active);
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsEditOpen(true)}
        aria-label="Editar categoría"
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
        aria-label={category.active ? "Desactivar" : "Activar"}
        className="h-7 w-7"
      >
        <Power className="h-3 w-3" />
      </Button>
      <CategoryFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        federationTypeId={category.federationTypeId}
        category={category}
      />
    </div>
  );
}
