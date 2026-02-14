"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilterNavigation } from "@/hooks/use-filter-navigation";

export function EmptyState() {
  const { clearAll, searchParams } = useFilterNavigation();

  const hasFilters = Array.from(searchParams.keys()).some(
    (k) => !["seasonId", "sortBy", "sortDir", "page"].includes(k),
  );

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <SearchX className="h-10 w-10" />
      <p className="text-sm">No se encontraron miembros.</p>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={clearAll}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
