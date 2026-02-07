"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { formatPrice } from "@/helpers/price-calculator";
import type { Supplement } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type SupplementSelectorProps = {
  supplements: Supplement[];
};

export function SupplementSelector({ supplements }: SupplementSelectorProps) {
  const form = useFormContext<RegistrationInput>();

  if (supplements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Suplementos opcionales</h3>
      <div className="grid gap-2">
        {supplements.map((supplement) => (
          <FormField
            key={supplement.id}
            control={form.control}
            name="supplementIds"
            render={({ field }) => {
              const isChecked = field.value?.includes(supplement.id);

              return (
                <FormItem>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = field.value ?? [];
                          field.onChange(
                            checked
                              ? [...current, supplement.id]
                              : current.filter(
                                  (id: string) => id !== supplement.id,
                                ),
                          );
                        }}
                      />
                    </FormControl>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <span className="font-medium">{supplement.name}</span>
                        <p className="text-sm text-muted-foreground">
                          {supplement.description}
                        </p>
                      </div>
                      <span className="font-semibold">
                        +{formatPrice(supplement.price)}
                      </span>
                    </div>
                  </label>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
