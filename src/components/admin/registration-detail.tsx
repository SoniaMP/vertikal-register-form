import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/helpers/price-calculator";

type RegistrationData = {
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
  totalAmount: number;
  paymentStatus: string;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  confirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  federationType: { name: string };
  federationSubtype: { name: string };
  subtypePrice: number;
  supplements: {
    priceAtTime: number;
    supplement: { name: string };
  }[];
};

type Props = { registration: RegistrationData };

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completado",
  PENDING: "Pendiente",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export function RegistrationDetail({ registration: r }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PersonalDataCard registration={r} />
      <PaymentCard registration={r} />
    </div>
  );
}

function PersonalDataCard({ registration: r }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Datos personales</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Field label="Nombre" value={r.firstName} />
        <Field label="Apellidos" value={r.lastName} />
        <Field label="Email" value={r.email} />
        <Field label="Teléfono" value={r.phone} />
        <Field label="DNI" value={r.dni} />
        <Field label="Fecha de nacimiento" value={r.dateOfBirth} />
        <Field label="Dirección" value={r.address} />
        <Field label="Ciudad" value={r.city} />
        <Field label="Código postal" value={r.postalCode} />
        <Field label="Provincia" value={r.province} />
      </CardContent>
    </Card>
  );
}

function PaymentCard({ registration: r }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pago y federativa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Estado del pago</span>
          <Badge variant={STATUS_VARIANTS[r.paymentStatus] ?? "outline"}>
            {STATUS_LABELS[r.paymentStatus] ?? r.paymentStatus}
          </Badge>
        </div>
        <Separator />
        <Field
          label="Federativa"
          value={`${r.federationType.name} - ${r.federationSubtype.name} — ${formatPrice(r.subtypePrice)}`}
        />
        {r.supplements.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Suplementos</p>
            <ul className="space-y-1">
              {r.supplements.map((s) => (
                <li
                  key={s.supplement.name}
                  className="text-sm flex justify-between"
                >
                  <span>{s.supplement.name}</span>
                  <span className="text-muted-foreground">
                    {formatPrice(s.priceAtTime)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(r.totalAmount)}</span>
        </div>
        <Separator />
        <Field label="Email de confirmación enviado" value={r.confirmationSent ? "Sí" : "No"} />
        {r.stripePaymentId && (
          <Field label="Stripe Payment ID" value={r.stripePaymentId} />
        )}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Field label="Creado" value={formatDate(r.createdAt)} />
          <Field label="Actualizado" value={formatDate(r.updatedAt)} />
        </div>
      </CardContent>
    </Card>
  );
}
