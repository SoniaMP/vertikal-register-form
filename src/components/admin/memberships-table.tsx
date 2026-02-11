import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/helpers/price-calculator";
import { MembershipActions } from "./membership-actions";
import { FederatedToggle } from "./federated-toggle";
import { cn } from "@/lib/utils";
import { MEMBERSHIP_STATUS } from "@/types";

export type MembershipRow = {
  id: string;
  status: string;
  paymentStatus: string;
  isFederated: boolean;
  totalAmount: number;
  createdAt: Date;
  member: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni: string;
    dateOfBirth: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
  };
  type: { name: string } | null;
  subtype: { name: string } | null;
};

type Props = { memberships: MembershipRow[] };

const PAYMENT_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  COMPLETED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

const PAYMENT_LABELS: Record<string, string> = {
  COMPLETED: "Completado",
  PENDING: "Pendiente",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pend. pago",
  ACTIVE: "Activo",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING_PAYMENT: "secondary",
  ACTIVE: "default",
  EXPIRED: "outline",
  CANCELLED: "destructive",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function licenseLabel(m: MembershipRow): string {
  const parts = [m.type?.name, m.subtype?.name].filter(Boolean);
  return parts.length > 0 ? parts.join(" - ") : "Sin licencia";
}

export function MembershipsTable({ memberships }: Props) {
  if (memberships.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No se encontraron miembros.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {memberships.map((m) => (
          <MobileCard key={m.id} membership={m} />
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Licencia</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Federado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((m) => (
              <DesktopRow key={m.id} membership={m} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function buildActionData(m: MembershipRow) {
  return { ...m.member, id: m.id, status: m.status, paymentStatus: m.paymentStatus };
}

function DesktopRow({ membership: m }: { membership: MembershipRow }) {
  const isCancelled = m.status === MEMBERSHIP_STATUS.CANCELLED;
  return (
    <TableRow className={cn(isCancelled && "opacity-50")}>
      <TableCell>
        <Link
          href={`/admin/registros/${m.id}`}
          className="font-medium hover:underline"
        >
          {m.member.firstName} {m.member.lastName}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{m.member.email}</TableCell>
      <TableCell>{licenseLabel(m)}</TableCell>
      <TableCell>{formatPrice(m.totalAmount)}</TableCell>
      <TableCell>
        <StatusBadges paymentStatus={m.paymentStatus} membershipStatus={m.status} />
      </TableCell>
      <TableCell>
        <FederatedToggle membershipId={m.id} isFederated={m.isFederated} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(m.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end">
          <MembershipActions membership={buildActionData(m)} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function MobileCard({ membership: m }: { membership: MembershipRow }) {
  const isCancelled = m.status === MEMBERSHIP_STATUS.CANCELLED;
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isCancelled && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/registros/${m.id}`}
          className="min-w-0 hover:underline"
        >
          <p className="font-medium truncate">
            {m.member.firstName} {m.member.lastName}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {m.member.email}
          </p>
        </Link>
        <div className="flex items-center gap-1.5">
          <StatusBadges paymentStatus={m.paymentStatus} membershipStatus={m.status} />
          <FederatedToggle membershipId={m.id} isFederated={m.isFederated} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{licenseLabel(m)}</span>
        <span>{formatPrice(m.totalAmount)}</span>
        <span className="ml-auto">{formatDate(m.createdAt)}</span>
      </div>
      <div className="mt-2 flex justify-end border-t pt-2">
        <MembershipActions membership={buildActionData(m)} />
      </div>
    </div>
  );
}

function StatusBadges({
  paymentStatus,
  membershipStatus,
}: {
  paymentStatus: string;
  membershipStatus: string;
}) {
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
