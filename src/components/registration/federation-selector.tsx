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
import type { LicenseCatalogType } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type FederationSelectorProps = {
  licenseTypes: LicenseCatalogType[];
};

export function FederationSelector({
  licenseTypes,
}: FederationSelectorProps) {
  const form = useFormContext<RegistrationInput>();

  return (
    <FormField
      control={form.control}
      name="typeId"
      render={({ field }) => (
        <FormItem>
          <h3 className="text-lg font-semibold">Tipo de licencia</h3>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("subtypeId", "");
                form.setValue("categoryId", "");
                form.setValue("supplementIds", []);
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {licenseTypes.map((lt) => (
                <label key={lt.id} className="cursor-pointer">
                  <Card
                    className={cn(
                      "transition-colors",
                      field.value === lt.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50",
                    )}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <RadioGroupItem value={lt.id} className="mt-1" />
                      <div className="flex-1">
                        <span className="font-medium">{lt.name}</span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {lt.description}
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
