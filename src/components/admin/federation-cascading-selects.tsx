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

export type LicenseTypeOption = {
  id: string;
  name: string;
  subtypes: SubtypeOption[];
};

type Props = {
  licenseTypes: LicenseTypeOption[];
  defaultTypeId?: string;
  defaultSubtypeId?: string;
  defaultCategoryId?: string;
};

export function FederationCascadingSelects({
  licenseTypes,
  defaultTypeId = "",
  defaultSubtypeId = "",
  defaultCategoryId = "",
}: Props) {
  const [selectedTypeId, setSelectedTypeId] = useState(defaultTypeId);
  const selectedType = licenseTypes.find((t) => t.id === selectedTypeId);

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="typeId">Tipo de licencia</Label>
        <Select
          name="typeId"
          defaultValue={defaultTypeId}
          onValueChange={setSelectedTypeId}
        >
          <SelectTrigger id="typeId">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {licenseTypes.map((lt) => (
              <SelectItem key={lt.id} value={lt.id}>
                {lt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="subtypeId">Subtipo</Label>
        <Select
          key={`subtype-${selectedTypeId}`}
          name="subtypeId"
          defaultValue={
            selectedTypeId === defaultTypeId ? defaultSubtypeId : ""
          }
        >
          <SelectTrigger id="subtypeId">
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
        <input
          type="hidden"
          name="categoryId"
          value={
            selectedTypeId === defaultTypeId ? defaultCategoryId : ""
          }
        />
      </div>
    </>
  );
}
