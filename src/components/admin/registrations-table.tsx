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

type Registration = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  federationType: { name: string };
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Federativa</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((reg) => (
          <TableRow key={reg.id}>
            <TableCell>
              <Link
                href={`/admin/registros/${reg.id}`}
                className="font-medium hover:underline"
              >
                {reg.firstName} {reg.lastName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {reg.email}
            </TableCell>
            <TableCell>{reg.federationType.name}</TableCell>
            <TableCell>{formatPrice(reg.totalAmount)}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANTS[reg.paymentStatus] ?? "outline"}>
                {STATUS_LABELS[reg.paymentStatus] ?? reg.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(reg.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
