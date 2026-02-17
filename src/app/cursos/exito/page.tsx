import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmCourseCheckout } from "@/lib/stripe-confirm";

export const metadata = {
  title: "Inscripción completada - Club Vertikal",
  description: "Tu inscripción al curso se ha completado correctamente",
};

type ExitoPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CursoExitoPage({
  searchParams,
}: ExitoPageProps) {
  const { session_id: sessionId } = await searchParams;

  let isConfirmed = false;
  if (sessionId) {
    try {
      isConfirmed = await confirmCourseCheckout(sessionId);
    } catch {
      /* Stripe call failed; show fallback message */
    }
  }

  if (!isConfirmed) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <AlertTriangle className="mb-6 size-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">No se pudo confirmar el pago</h2>
        <p className="mt-4 text-muted-foreground">
          Si realizaste el pago, recibirás la confirmación en breve por email.
        </p>
        <Button asChild className="mt-8">
          <Link href="/cursos">Volver a cursos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 text-center">
      <CheckCircle2 className="mb-6 size-16 text-green-600" />
      <h2 className="text-2xl font-bold">Inscripción completada</h2>
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
        <Link href="/cursos">Volver a cursos</Link>
      </Button>
    </div>
  );
}
