"use client";

import { Download, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFilterNavigation } from "@/hooks/use-filter-navigation";
import {
  PAYMENT_LABELS,
  STATUS_LABELS,
} from "./membership-status-badges";
import { SavedViewsSelector } from "./saved-views-selector";

const PAYMENT_OPTIONS = Object.entries(PAYMENT_LABELS);
const STATUS_OPTIONS = Object.entries(STATUS_LABELS);

export function MembershipsToolbar() {
  const { updateParam, updateParamDebounced, clearAll, searchParams } =
    useFilterNavigation();

  const hasFilters = Array.from(searchParams.keys()).some(
    (k) => !["seasonId", "sortBy", "sortDir", "page"].includes(k),
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Input
        placeholder="Buscar por nombre, DNI o email..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateParamDebounced("search", e.target.value)}
        className="sm:w-64"
      />

      <Select
        value={searchParams.get("paymentStatus") ?? "all"}
        onValueChange={(v) => updateParam("paymentStatus", v)}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Estado de pago" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Pago: Todos</SelectItem>
          {PAYMENT_OPTIONS.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("membershipStatus") ?? "all"}
        onValueChange={(v) => updateParam("membershipStatus", v)}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Estado membresía" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Estado: Todos</SelectItem>
          {STATUS_OPTIONS.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("federated") ?? "all"}
        onValueChange={(v) => updateParam("federated", v)}
      >
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="Federado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Federado: Todos</SelectItem>
          <SelectItem value="true">Sí</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      <SavedViewsSelector />

      <Button variant="outline" size="sm" className="gap-1.5" asChild>
        <a href={`/admin/export?${searchParams.toString()}`} download>
          <Download className="h-3.5 w-3.5" />
          Exportar
        </a>
      </Button>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="gap-1.5"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
