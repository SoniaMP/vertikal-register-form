"use client";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Algo ha salido mal</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || "Ha ocurrido un error inesperado."}
      </p>
      <Button onClick={reset} className="mt-8">
        Reintentar
      </Button>
    </div>
  );
}
