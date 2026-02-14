"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CoursePersonalFields } from "./course-personal-fields";
import { CourseLicenseUpload } from "./course-license-upload";
import { CoursePriceSelector } from "./course-price-selector";
import {
  courseRegistrationCheckoutSchema,
  type CourseRegistrationCheckoutInput,
} from "@/validations/course";

type PriceTier = {
  id: string;
  name: string;
  amountCents: number;
};

type CourseRegistrationFormProps = {
  courseCatalogId: string;
  prices: PriceTier[];
  isFull: boolean;
};

export function CourseRegistrationForm({
  courseCatalogId,
  prices,
  isFull,
}: CourseRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CourseRegistrationCheckoutInput>({
    resolver: zodResolver(courseRegistrationCheckoutSchema),
    defaultValues: {
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
      courseCatalogId,
      coursePriceId: "",
      licenseFileUrl: "",
    },
  });

  async function handleSubmit() {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const data = form.getValues();
      const res = await fetch("/api/course-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result: { url?: string; error?: string };
      try {
        result = await res.json();
      } catch {
        setError("Error inesperado del servidor. Inténtalo de nuevo.");
        return;
      }

      if (!res.ok) {
        setError(result.error ?? "Error al procesar la inscripción");
        return;
      }

      if (!result.url) {
        setError("No se recibió la URL de pago. Inténtalo de nuevo.");
        return;
      }

      window.location.href = result.url;
    } catch {
      setError("Error de conexión. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isFull) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="font-semibold text-destructive">
          No quedan plazas disponibles para este curso.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <CoursePersonalFields />
        <CourseLicenseUpload />
        <CoursePriceSelector prices={prices} />

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSubmitting ? "Procesando..." : "Inscribirse y pagar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
