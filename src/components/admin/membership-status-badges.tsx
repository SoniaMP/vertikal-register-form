import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_STATUS } from "@/types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const PAYMENT_VARIANTS: Record<string, BadgeVariant> = {
  COMPLETED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export const PAYMENT_LABELS: Record<string, string> = {
  COMPLETED: "Completado",
  PENDING: "Pendiente",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pend. pago",
  ACTIVE: "Activo",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
};

export const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  PENDING_PAYMENT: "secondary",
  ACTIVE: "default",
  EXPIRED: "outline",
  CANCELLED: "destructive",
};

type Props = {
  paymentStatus: string;
  membershipStatus: string;
};

export function StatusBadges({ paymentStatus, membershipStatus }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={PAYMENT_VARIANTS[paymentStatus] ?? "outline"}>
        {PAYMENT_LABELS[paymentStatus] ?? paymentStatus}
      </Badge>
      {membershipStatus !== MEMBERSHIP_STATUS.ACTIVE && (
        <Badge variant={STATUS_VARIANTS[membershipStatus] ?? "outline"}>
          {STATUS_LABELS[membershipStatus] ?? membershipStatus}
        </Badge>
      )}
    </div>
  );
}
