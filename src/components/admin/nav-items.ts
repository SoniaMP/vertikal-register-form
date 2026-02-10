import { ClipboardList, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Miembros", icon: ClipboardList },
  { href: "/admin/tipos-federacion", label: "Tipos federativa", icon: Shield },
];
