"use client";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function AdminError({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || "Ha ocurrido un error al cargar los datos."}
      </p>
      <Button onClick={reset} className="mt-8">
        Reintentar
      </Button>
    </div>
  );
}
