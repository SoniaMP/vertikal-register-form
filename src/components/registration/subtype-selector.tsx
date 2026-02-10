"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FederationSubtype } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type SubtypeSelectorProps = {
  subtypes: FederationSubtype[];
};

export function SubtypeSelector({ subtypes }: SubtypeSelectorProps) {
  const form = useFormContext<RegistrationInput>();

  if (subtypes.length === 0) return null;

  return (
    <FormField
      control={form.control}
      name="federationSubtypeId"
      render={({ field }) => (
        <FormItem>
          <h3 className="text-lg font-semibold">Modalidad</h3>
          <FormControl>
            <Select
              value={field.value || undefined}
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("categoryId", "");
                form.setValue("supplementIds", []);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una modalidad" />
              </SelectTrigger>
              <SelectContent>
                {subtypes.map((st) => (
                  <SelectItem key={st.id} value={st.id}>
                    {st.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
