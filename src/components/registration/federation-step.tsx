"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FederationSelector } from "./federation-selector";
import { SupplementSelector } from "./supplement-selector";
import { PriceSummary } from "./price-summary";
import { calculateTotal } from "@/helpers/price-calculator";
import type { FederationType } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type FederationStepProps = {
  federationTypes: FederationType[];
  onNext: () => void;
  onBack: () => void;
};

export function FederationStep({
  federationTypes,
  onNext,
  onBack,
}: FederationStepProps) {
  const form = useFormContext<RegistrationInput>();
  const selectedFederationId = form.watch("federationTypeId");
  const selectedSupplementIds = form.watch("supplementIds");

  const selectedFederation = federationTypes.find(
    (ft) => ft.id === selectedFederationId,
  );

  const selectedSupplements =
    selectedFederation?.supplements.filter((s) =>
      selectedSupplementIds?.includes(s.id),
    ) ?? [];

  const breakdown = selectedFederation
    ? calculateTotal(selectedFederation, selectedSupplements)
    : null;

  return (
    <div className="space-y-6">
      <FederationSelector federationTypes={federationTypes} />

      {selectedFederation && (
        <>
          <SupplementSelector supplements={selectedFederation.supplements} />
          {breakdown && <PriceSummary breakdown={breakdown} />}
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Anterior
        </Button>
        <Button type="button" onClick={onNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
