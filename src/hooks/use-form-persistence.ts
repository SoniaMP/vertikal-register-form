"use client";

import { useEffect, useCallback } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

const STORAGE_KEY = "vertikal-registration-form";
const STEP_KEY = "vertikal-registration-step";

type UseFormPersistenceOptions<T extends FieldValues> = {
  form: UseFormReturn<T>;
  currentStep: number;
  onRestoreStep: (step: number) => void;
};

export function useFormPersistence<T extends FieldValues>({
  form,
  currentStep,
  onRestoreStep,
}: UseFormPersistenceOptions<T>) {
  // Restore saved form data on mount
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      const savedStep = sessionStorage.getItem(STEP_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as T;
        form.reset(parsed);
      }
      if (savedStep) {
        const step = Number(savedStep);
        if (step >= 1 && step <= 3) onRestoreStep(step);
      }
    } catch {
      // Ignore corrupted storage data
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        // sessionStorage might be full or unavailable
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Save current step
  useEffect(() => {
    try {
      sessionStorage.setItem(STEP_KEY, String(currentStep));
    } catch {
      // Ignore storage errors
    }
  }, [currentStep]);

  const clearSavedData = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STEP_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return { clearSavedData };
}
