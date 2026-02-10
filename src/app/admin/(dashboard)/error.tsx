"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Server Component Error:", error.message, error.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || "Ha ocurrido un error al cargar los datos."}
      </p>
      {error.digest && (
        <p className="mt-2 text-muted-foreground text-xs font-mono">
          Digest: {error.digest}
        </p>
      )}
      <Button onClick={reset} className="mt-8">
        Reintentar
      </Button>
    </div>
  );
}
