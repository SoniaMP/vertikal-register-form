"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { FederationType } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type FederationSelectorProps = {
  federationTypes: FederationType[];
};

export function FederationSelector({
  federationTypes,
}: FederationSelectorProps) {
  const form = useFormContext<RegistrationInput>();

  return (
    <FormField
      control={form.control}
      name="federationTypeId"
      render={({ field }) => (
        <FormItem>
          <h3 className="text-lg font-semibold">Tipo de federativa</h3>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("federationSubtypeId", "");
                form.setValue("categoryId", "");
                form.setValue("supplementIds", []);
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {federationTypes.map((ft) => (
                <label key={ft.id} className="cursor-pointer">
                  <Card
                    className={cn(
                      "transition-colors",
                      field.value === ft.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50",
                    )}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <RadioGroupItem value={ft.id} className="mt-1" />
                      <div className="flex-1">
                        <span className="font-medium">{ft.name}</span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {ft.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
