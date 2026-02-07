"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriceSummary } from "./price-summary";
import { calculateTotal } from "@/helpers/price-calculator";
import type { FederationType } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type RegistrationSummaryProps = {
  federationTypes: FederationType[];
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function RegistrationSummary({
  federationTypes,
  onEdit,
  onSubmit,
  isSubmitting,
}: RegistrationSummaryProps) {
  const form = useFormContext<RegistrationInput>();
  const data = form.getValues();

  const federation = federationTypes.find(
    (ft) => ft.id === data.federationTypeId,
  );
  const selectedSupplements =
    federation?.supplements.filter((s) =>
      data.supplementIds?.includes(s.id),
    ) ?? [];
  const breakdown = federation
    ? calculateTotal(federation, selectedSupplements)
    : null;

  return (
    <div className="space-y-6">
      <SummarySection title="Datos personales" onEdit={() => onEdit(1)}>
        <SummaryRow label="Nombre" value={`${data.firstName} ${data.lastName}`} />
        <SummaryRow label="Email" value={data.email} />
        <SummaryRow label="Teléfono" value={data.phone} />
        <SummaryRow label="DNI" value={data.dni} />
        <SummaryRow label="Fecha de nacimiento" value={data.dateOfBirth} />
        <SummaryRow
          label="Dirección"
          value={`${data.address}, ${data.postalCode} ${data.city} (${data.province})`}
        />
      </SummarySection>

      <Separator />

      <SummarySection title="Federativa y suplementos" onEdit={() => onEdit(2)}>
        <SummaryRow label="Tipo" value={federation?.name ?? ""} />
        {selectedSupplements.length > 0 && (
          <SummaryRow
            label="Suplementos"
            value={selectedSupplements.map((s) => s.name).join(", ")}
          />
        )}
      </SummarySection>

      {breakdown && (
        <>
          <Separator />
          <PriceSummary breakdown={breakdown} />
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => onEdit(2)}>
          Anterior
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Proceder al pago"}
        </Button>
      </div>
    </div>
  );
}

type SummarySectionProps = {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
};

function SummarySection({ title, onEdit, children }: SummarySectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Editar
        </Button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
