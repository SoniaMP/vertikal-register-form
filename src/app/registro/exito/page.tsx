import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Registro completado - Club Vertikal",
  description: "Tu registro se ha completado correctamente",
};

type ExitoPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ExitoPage({ searchParams }: ExitoPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="flex flex-col items-center py-10 text-center">
      <CheckCircle2 className="mb-6 size-16 text-green-600" />
      <h2 className="text-2xl font-bold">Registro completado</h2>
      <p className="mt-4 text-muted-foreground">
        Tu pago se ha procesado correctamente. Recibirás un email de
        confirmación en breve.
      </p>
      {sessionId && (
        <p className="mt-2 text-sm text-muted-foreground">
          Referencia: <span className="font-mono">{sessionId}</span>
        </p>
      )}
      <Button asChild className="mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
