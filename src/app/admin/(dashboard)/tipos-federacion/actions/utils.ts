export function parsePrice(formData: FormData): number {
  const raw = formData.get("price") as string;
  return Math.round(parseFloat(raw) * 100);
}
