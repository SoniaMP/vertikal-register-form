import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegistrationNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Registro no encontrado</h1>
      <p className="mt-4 text-muted-foreground">
        El registro que buscas no existe o ha sido eliminado.
      </p>
      <Button asChild className="mt-8">
        <Link href="/admin">Volver a registros</Link>
      </Button>
    </div>
  );
}
