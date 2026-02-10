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
import { formatPrice } from "@/helpers/price-calculator";
import type { Category } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type CategorySelectorProps = {
  categories: Category[];
  selectedSubtypeId: string;
};

export function CategorySelector({
  categories,
  selectedSubtypeId,
}: CategorySelectorProps) {
  const form = useFormContext<RegistrationInput>();

  const activeCategories = categories.filter((c) => c.active);

  if (activeCategories.length === 0) return null;

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <h3 className="text-lg font-semibold">Categoría</h3>
          <FormControl>
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {activeCategories.map((cat) => {
                  const priceEntry = cat.prices.find(
                    (p) => p.subtypeId === selectedSubtypeId,
                  );
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                      {priceEntry ? ` — ${formatPrice(priceEntry.price)}` : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
