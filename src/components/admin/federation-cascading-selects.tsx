"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubtypeOption = { id: string; name: string };
type CategoryOption = { id: string; name: string };

export type FederationTypeOption = {
  id: string;
  name: string;
  subtypes: SubtypeOption[];
  categories: CategoryOption[];
};

type Props = {
  federationTypes: FederationTypeOption[];
  defaultTypeId?: string;
  defaultSubtypeId?: string;
  defaultCategoryId?: string;
};

export function FederationCascadingSelects({
  federationTypes,
  defaultTypeId = "",
  defaultSubtypeId = "",
  defaultCategoryId = "",
}: Props) {
  const [selectedTypeId, setSelectedTypeId] = useState(defaultTypeId);
  const selectedType = federationTypes.find((t) => t.id === selectedTypeId);

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="federationTypeId">Tipo de federativa</Label>
        <Select
          name="federationTypeId"
          defaultValue={defaultTypeId}
          onValueChange={setSelectedTypeId}
        >
          <SelectTrigger id="federationTypeId">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {federationTypes.map((ft) => (
              <SelectItem key={ft.id} value={ft.id}>
                {ft.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="federationSubtypeId">Subtipo</Label>
        <Select
          key={`subtype-${selectedTypeId}`}
          name="federationSubtypeId"
          defaultValue={
            selectedTypeId === defaultTypeId ? defaultSubtypeId : ""
          }
        >
          <SelectTrigger id="federationSubtypeId">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {(selectedType?.subtypes ?? []).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="categoryId">Categoría</Label>
        <Select
          key={`category-${selectedTypeId}`}
          name="categoryId"
          defaultValue={
            selectedTypeId === defaultTypeId ? defaultCategoryId : ""
          }
        >
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {(selectedType?.categories ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
