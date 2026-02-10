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
import { formatPrice } from "@/helpers/price-calculator";
import { cn } from "@/lib/utils";
import type { FederationSubtype } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type SubtypeSelectorProps = {
  subtypes: FederationSubtype[];
};

export function SubtypeSelector({ subtypes }: SubtypeSelectorProps) {
  const form = useFormContext<RegistrationInput>();

  if (subtypes.length === 0) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="federationSubtypeId"
      render={({ field }) => (
        <FormItem>
          <h3 className="text-lg font-semibold">Modalidad</h3>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("supplementIds", []);
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {subtypes.map((st) => (
                <label key={st.id} className="cursor-pointer">
                  <Card
                    className={cn(
                      "transition-colors",
                      field.value === st.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50",
                    )}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <RadioGroupItem value={st.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{st.name}</span>
                          <span className="font-semibold text-primary">
                            {formatPrice(st.price)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {st.description}
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
