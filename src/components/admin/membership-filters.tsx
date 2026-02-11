"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AdvancedFiltersSheet } from "./advanced-filters-sheet";

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "COMPLETED", label: "Completado" },
  { value: "FAILED", label: "Fallido" },
  { value: "REFUNDED", label: "Reembolsado" },
];

type LicenseTypeOption = { id: string; name: string };

type Props = {
  licenseTypes: LicenseTypeOption[];
};

export function MembershipFilters({ licenseTypes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/admin?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleClear = useCallback(() => {
    router.push("/admin");
  }, [router]);

  const hasFilters = searchParams.toString() !== "";

  return (
    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-end">
      <Input
        placeholder="Buscar por nombre o email..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateParam("search", e.target.value)}
        className="sm:w-64"
      />
      <Select
        defaultValue={searchParams.get("type") ?? "all"}
        onValueChange={(v) => updateParam("type", v)}
      >
        <SelectTrigger className="sm:w-52">
          <SelectValue placeholder="Tipo de licencia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {licenseTypes.map((lt) => (
            <SelectItem key={lt.id} value={lt.id}>
              {lt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Estado de pago" />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <AdvancedFiltersSheet />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
