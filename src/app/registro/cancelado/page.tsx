import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pago cancelado - Vertikal Club",
  description: "El pago ha sido cancelado",
};

export default function CanceladoPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <XCircle className="mb-6 size-16 text-destructive" />
      <h1 className="text-3xl font-bold">Pago cancelado</h1>
      <p className="mt-4 text-muted-foreground">
        El proceso de pago ha sido cancelado. No se ha realizado ningún cargo.
      </p>
      <p className="mt-2 text-muted-foreground">
        Puedes volver a intentarlo cuando quieras.
      </p>
      <Button asChild className="mt-8">
        <Link href="/registro">Reintentar registro</Link>
      </Button>
    </div>
  );
}
