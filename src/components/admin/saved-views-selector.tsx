"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFilterNavigation } from "@/hooks/use-filter-navigation";

const VIEWS = [
  { value: "federados", label: "Federados" },
  { value: "no_federados", label: "No federados" },
] as const;

export function SavedViewsSelector() {
  const { searchParams, updateParam } = useFilterNavigation();
  const currentView = searchParams.get("view") ?? "";

  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      {VIEWS.map(({ value, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-3 text-xs",
            currentView === value &&
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
          )}
          onClick={() =>
            updateParam("view", currentView === value ? "" : value)
          }
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
