"use client";

import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatPrice } from "@/helpers/price-calculator";
import type { CourseRegistrationCheckoutInput } from "@/validations/course";

type PriceTier = {
  id: string;
  name: string;
  amountCents: number;
};

export function CoursePriceSelector({ prices }: { prices: PriceTier[] }) {
  const form = useFormContext<CourseRegistrationCheckoutInput>();

  return (
    <FormField
      control={form.control}
      name="coursePriceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Selecciona tarifa</FormLabel>
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {prices.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <RadioGroupItem value={p.id} id={p.id} />
                <Label htmlFor={p.id} className="cursor-pointer">
                  {p.name} — {formatPrice(p.amountCents)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
