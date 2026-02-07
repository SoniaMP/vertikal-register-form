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

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "COMPLETED", label: "Completado" },
  { value: "FAILED", label: "Fallido" },
  { value: "REFUNDED", label: "Reembolsado" },
];

type FederationOption = { id: string; name: string };

type Props = {
  federationTypes: FederationOption[];
};

export function RegistrationFilters({ federationTypes }: Props) {
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
    <div className="flex flex-wrap items-end gap-3">
      <Input
        placeholder="Buscar por nombre o email..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateParam("search", e.target.value)}
        className="w-64"
      />
      <Select
        defaultValue={searchParams.get("federation") ?? "all"}
        onValueChange={(v) => updateParam("federation", v)}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Tipo de federativa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las federativas</SelectItem>
          {federationTypes.map((ft) => (
            <SelectItem key={ft.id} value={ft.id}>
              {ft.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="w-44">
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
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
