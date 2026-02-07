"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { RegistrationInput } from "@/validations/registration";

type PersonalDataFormProps = {
  onNext: () => void;
};

export function PersonalDataForm({ onNext }: PersonalDataFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="firstName" label="Nombre" placeholder="Juan" />
        <TextField
          name="lastName"
          label="Apellidos"
          placeholder="García López"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="juan@ejemplo.com"
        />
        <TextField
          name="phone"
          label="Teléfono"
          type="tel"
          placeholder="612345678"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="dni" label="DNI" placeholder="12345678A" />
        <TextField
          name="dateOfBirth"
          label="Fecha de nacimiento"
          type="date"
        />
      </div>
      <TextField
        name="address"
        label="Dirección"
        placeholder="Calle Mayor 1, 2ºA"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField name="city" label="Ciudad" placeholder="Madrid" />
        <TextField
          name="postalCode"
          label="Código postal"
          placeholder="28001"
        />
        <TextField name="province" label="Provincia" placeholder="Madrid" />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="button" onClick={onNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}

type TextFieldProps = {
  name: keyof RegistrationInput;
  label: string;
  type?: string;
  placeholder?: string;
};

function TextField({
  name,
  label,
  type = "text",
  placeholder,
}: TextFieldProps) {
  const form = useFormContext<RegistrationInput>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
