"use client";

import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/helpers/price-calculator";
import type { PriceBreakdown } from "@/types";

type PriceSummaryProps = {
  breakdown: PriceBreakdown;
};

export function PriceSummary({ breakdown }: PriceSummaryProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h4 className="mb-3 font-semibold">Resumen de precio</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Federativa</span>
          <span>{formatPrice(breakdown.federationPrice)}</span>
        </div>
        {breakdown.supplements.map((s) => (
          <div key={s.name} className="flex justify-between text-muted-foreground">
            <span>{s.name}</span>
            <span>+{formatPrice(s.price)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(breakdown.total)}</span>
        </div>
      </div>
    </div>
  );
}
