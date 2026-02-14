"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { SortField, SortDirection } from "@/types/membership-filters";

type Props = {
  field: SortField;
  label: string;
  currentSort: SortField;
  currentDir: SortDirection;
  className?: string;
};

export function SortableHeader({
  field,
  label,
  currentSort,
  currentDir,
  className,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = currentSort === field;

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
      params.set("sortDir", currentDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortDir", "asc");
    }
    params.delete("page");
    router.push(`/admin?${params.toString()}`);
  }

  const Icon = isActive
    ? currentDir === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  const ariaSort = isActive
    ? currentDir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <TableHead className={className} aria-sort={ariaSort as "ascending" | "descending" | "none"}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Ordenar por ${label}`}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}
