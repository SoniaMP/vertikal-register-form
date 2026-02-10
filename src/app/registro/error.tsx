"use client";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RegistroError({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Error al cargar el registro</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message ||
          "No se ha podido cargar el formulario. Inténtalo de nuevo."}
      </p>
      <Button onClick={reset} className="mt-8">
        Reintentar
      </Button>
    </div>
  );
}
