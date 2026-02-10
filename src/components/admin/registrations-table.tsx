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
import { RegistrationActions } from "./registration-actions";
import { FederatedToggle } from "./federated-toggle";
import { cn } from "@/lib/utils";

type Registration = {
  id: string;
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
  paymentStatus: string;
  active: boolean;
  isFederated: boolean;
  totalAmount: number;
  createdAt: Date;
  federationType: { name: string };
  federationSubtype: { name: string };
};

type Props = {
  registrations: Registration[];
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  COMPLETED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completado",
  PENDING: "Pendiente",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function RegistrationsTable({ registrations }: Props) {
  if (registrations.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No se encontraron registros.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {registrations.map((reg) => (
          <MobileRegistrationCard key={reg.id} registration={reg} />
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Federativa</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Federado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg) => (
              <DesktopRow key={reg.id} registration={reg} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function DesktopRow({ registration: reg }: { registration: Registration }) {
  return (
    <TableRow className={cn(!reg.active && "opacity-50")}>
      <TableCell>
        <Link
          href={`/admin/registros/${reg.id}`}
          className="font-medium hover:underline"
        >
          {reg.firstName} {reg.lastName}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{reg.email}</TableCell>
      <TableCell>
        {reg.federationType.name} - {reg.federationSubtype.name}
      </TableCell>
      <TableCell>{formatPrice(reg.totalAmount)}</TableCell>
      <TableCell>
        <StatusBadge status={reg.paymentStatus} isActive={reg.active} />
      </TableCell>
      <TableCell>
        <FederatedToggle registrationId={reg.id} isFederated={reg.isFederated} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(reg.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end">
          <RegistrationActions registration={reg} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function MobileRegistrationCard({
  registration: reg,
}: {
  registration: Registration;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        !reg.active && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/registros/${reg.id}`}
          className="min-w-0 hover:underline"
        >
          <p className="font-medium truncate">
            {reg.firstName} {reg.lastName}
          </p>
          <p className="text-sm text-muted-foreground truncate">{reg.email}</p>
        </Link>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={reg.paymentStatus} isActive={reg.active} />
          <FederatedToggle registrationId={reg.id} isFederated={reg.isFederated} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          {reg.federationType.name} - {reg.federationSubtype.name}
        </span>
        <span>{formatPrice(reg.totalAmount)}</span>
        <span className="ml-auto">{formatDate(reg.createdAt)}</span>
      </div>
      <div className="mt-2 flex justify-end border-t pt-2">
        <RegistrationActions registration={reg} />
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  isActive,
}: {
  status: string;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={STATUS_VARIANTS[status] ?? "outline"}>
        {STATUS_LABELS[status] ?? status}
      </Badge>
      {!isActive && <Badge variant="outline">Inactivo</Badge>}
    </div>
  );
}
