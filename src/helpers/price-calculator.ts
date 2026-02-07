import type { FederationType, PriceBreakdown, Supplement } from "@/types";

export function calculateTotal(
  federationType: FederationType,
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
    federationPrice: federationType.price,
    supplements,
    total: federationType.price + supplementsTotal,
  };
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
