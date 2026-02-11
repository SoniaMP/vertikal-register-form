"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { StepIndicator } from "./step-indicator";
import { PersonalDataForm } from "./personal-data-form";
import { FederationStep } from "./federation-step";
import { RegistrationSummary } from "./registration-summary";
import { RenewalBanner } from "./renewal-banner";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import {
  personalDataSchema,
  federationSelectionSchema,
  registrationSchema,
  type RegistrationInput,
} from "@/validations/registration";
import type { FederationType } from "@/types";

type RegistrationWizardProps = {
  federationTypes: FederationType[];
  membershipFee: number;
  mode?: "new" | "renewal";
  defaultValues?: Partial<RegistrationInput>;
};

const EMPTY_DEFAULTS: RegistrationInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dni: "",
  dateOfBirth: "",
  address: "",
  city: "",
  postalCode: "",
  province: "",
  federationTypeId: "",
  federationSubtypeId: "",
  categoryId: "",
  supplementIds: [],
};

export function RegistrationWizard({
  federationTypes,
  membershipFee,
  mode = "new",
  defaultValues,
}: RegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  });

  const { clearSavedData } = useFormPersistence({
    form,
    currentStep,
    onRestoreStep: setCurrentStep,
    resetOnRestore: {
      federationTypeId: "",
      federationSubtypeId: "",
      categoryId: "",
      supplementIds: [],
    },
  });

  async function handleNextStep() {
    if (currentStep === 1) {
      const isValid = await form.trigger(personalDataSchema.keyof().options);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await form.trigger(
        federationSelectionSchema.keyof().options,
      );
      if (isValid) setCurrentStep(3);
    }
  }

  async function handleSubmit() {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const data = form.getValues();
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result: { url?: string; error?: string };
      try {
        result = await response.json();
      } catch {
        setError("Error inesperado del servidor. Inténtalo de nuevo.");
        return;
      }

      if (!response.ok) {
        setError(result.error ?? "Error al procesar el registro");
        return;
      }

      if (!result.url) {
        setError("No se recibió la URL de pago. Inténtalo de nuevo.");
        return;
      }

      // Clear saved form data and redirect to Stripe Checkout
      clearSavedData();
      window.location.href = result.url;
    } catch {
      setError("Error de conexión. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        {mode === "renewal" && <RenewalBanner />}
        <StepIndicator currentStep={currentStep} />

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {currentStep === 1 && (
          <PersonalDataForm onNext={handleNextStep} />
        )}

        {currentStep === 2 && (
          <FederationStep
            federationTypes={federationTypes}
            membershipFee={membershipFee}
            onNext={handleNextStep}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <RegistrationSummary
            federationTypes={federationTypes}
            membershipFee={membershipFee}
            onEdit={setCurrentStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form>
    </Form>
  );
}
