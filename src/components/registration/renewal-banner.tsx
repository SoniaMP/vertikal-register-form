import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RenewalBanner() {
  return (
    <Alert className="mb-6">
      <Info />
      <AlertDescription>
        Comprueba que tus datos son correctos para la renovación
      </AlertDescription>
    </Alert>
  );
}
