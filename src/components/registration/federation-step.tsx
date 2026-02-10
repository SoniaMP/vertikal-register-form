"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FederationSelector } from "./federation-selector";
import { SubtypeSelector } from "./subtype-selector";
import { CategorySelector } from "./category-selector";
import { SupplementSelector } from "./supplement-selector";
import { PriceSummary } from "./price-summary";
import { calculateTotal } from "@/helpers/price-calculator";
import type { FederationType } from "@/types";
import type { RegistrationInput } from "@/validations/registration";

type FederationStepProps = {
  federationTypes: FederationType[];
  membershipFee: number;
  onNext: () => void;
  onBack: () => void;
};

export function FederationStep({
  federationTypes,
  membershipFee,
  onNext,
  onBack,
}: FederationStepProps) {
  const form = useFormContext<RegistrationInput>();
  const selectedFederationId = form.watch("federationTypeId");
  const selectedSubtypeId = form.watch("federationSubtypeId");
  const selectedCategoryId = form.watch("categoryId");
  const selectedSupplementIds = form.watch("supplementIds");

  const selectedFederation = federationTypes.find(
    (ft) => ft.id === selectedFederationId,
  );

  const selectedSubtype = selectedFederation?.subtypes.find(
    (st) => st.id === selectedSubtypeId,
  );

  const selectedCategory = selectedFederation?.categories.find(
    (c) => c.id === selectedCategoryId,
  );

  const categoryPrice = selectedCategory?.prices.find(
    (p) => p.subtypeId === selectedSubtypeId,
  );

  const selectedSupplements =
    selectedFederation?.supplements.filter((s) =>
      selectedSupplementIds?.includes(s.id),
    ) ?? [];

  const breakdown =
    selectedCategory && categoryPrice
      ? calculateTotal(
          selectedCategory.name,
          categoryPrice.price,
          selectedSupplements,
          membershipFee,
        )
      : null;

  return (
    <div className="space-y-6">
      <FederationSelector federationTypes={federationTypes} />

      {selectedFederation && (
        <SubtypeSelector subtypes={selectedFederation.subtypes} />
      )}

      {selectedSubtype && selectedFederation && (
        <CategorySelector
          categories={selectedFederation.categories}
          selectedSubtypeId={selectedSubtypeId}
        />
      )}

      {selectedCategory && (
        <>
          <SupplementSelector
            supplements={selectedFederation!.supplements}
            supplementGroups={selectedFederation!.supplementGroups}
          />
          {breakdown && <PriceSummary breakdown={breakdown} />}
        </>
      )}

      <div className="flex justify-between">
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
