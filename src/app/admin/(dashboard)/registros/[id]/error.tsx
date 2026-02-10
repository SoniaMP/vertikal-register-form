"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RegistrationDetailError({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Error al cargar el registro</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || "No se ha podido cargar el detalle del registro."}
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin">Volver a registros</Link>
        </Button>
        <Button onClick={reset}>Reintentar</Button>
      </div>
    </div>
  );
}
