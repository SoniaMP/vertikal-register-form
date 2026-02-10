"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ADVANCED_KEYS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "dni",
  "city",
  "province",
  "postalCode",
  "address",
  "dateOfBirth",
  "federated",
  "active",
] as const;

type AdvancedKey = (typeof ADVANCED_KEYS)[number];

const TEXT_FIELDS: { key: AdvancedKey; label: string }[] = [
  { key: "firstName", label: "Nombre" },
  { key: "lastName", label: "Apellidos" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Teléfono" },
  { key: "dni", label: "DNI" },
  { key: "city", label: "Ciudad" },
  { key: "province", label: "Provincia" },
  { key: "postalCode", label: "Código postal" },
  { key: "address", label: "Dirección" },
  { key: "dateOfBirth", label: "Fecha de nacimiento" },
];

const BOOLEAN_FIELDS: { key: AdvancedKey; label: string }[] = [
  { key: "federated", label: "Federado" },
  { key: "active", label: "Activo" },
];

export function AdvancedFiltersSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(searchParams),
  );

  const activeCount = ADVANCED_KEYS.filter(
    (k) => searchParams.get(k),
  ).length;

  const handleOpen = useCallback(
    (open: boolean) => {
      if (open) setValues(buildInitialValues(searchParams));
      setIsOpen(open);
    },
    [searchParams],
  );

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    for (const key of ADVANCED_KEYS) {
      const val = values[key]?.trim();
      if (val && val !== "all") {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    }
    router.push(`/admin?${params.toString()}`);
    setIsOpen(false);
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ADVANCED_KEYS) params.delete(key);
    params.delete("page");
    router.push(`/admin?${params.toString()}`);
    setValues({});
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros avanzados
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros avanzados</SheetTitle>
          <SheetDescription>
            Filtra registros por cualquier campo.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {TEXT_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`filter-${key}`}>{label}</Label>
              <Input
                id={`filter-${key}`}
                value={values[key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={label}
              />
            </div>
          ))}
          {BOOLEAN_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Select
                value={values[key] ?? "all"}
                onValueChange={(v) =>
                  setValues((prev) => ({ ...prev, [key]: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function buildInitialValues(
  searchParams: URLSearchParams,
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of ADVANCED_KEYS) {
    const val = searchParams.get(key);
    if (val) values[key] = val;
  }
  return values;
}
