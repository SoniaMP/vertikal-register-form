import { RegistrationEntry } from "@/components/registration/registration-entry";
import { RegistrationHeader } from "@/components/registration/registration-header";

export const metadata = {
  title: "Registro - Club Vertikal",
  description: "Regístrate como socio del Club Vertikal",
};

export default function RegistroPage() {
  return (
    <>
      <RegistrationHeader />
      <RegistrationEntry />
    </>
  );
}
