import type { MembershipRow } from "./memberships-table";

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function licenseLabel(m: MembershipRow): string {
  const parts = [m.type?.name, m.subtype?.name].filter(Boolean);
  return parts.length > 0 ? parts.join(" - ") : "Sin licencia";
}
