import type { FederationSubtype, PriceBreakdown, Supplement } from "@/types";

export function calculateTotal(
  subtype: FederationSubtype,
  selectedSupplements: Supplement[],
): PriceBreakdown {
  const supplements = selectedSupplements.map((s) => ({
    name: s.name,
    price: s.price,
  }));

  const supplementsTotal = selectedSupplements.reduce(
    (sum, s) => sum + s.price,
    0,
  );

  return {
    subtypeName: subtype.name,
    subtypePrice: subtype.price,
    supplements,
    total: subtype.price + supplementsTotal,
  };
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
