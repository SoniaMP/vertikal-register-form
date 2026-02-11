import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegistrationFormData } from "./registration-form-dialog";

type Props = {
  registration?: Partial<RegistrationFormData>;
};

const FIELDS: {
  name: keyof RegistrationFormData;
  label: string;
  type?: string;
}[] = [
  { name: "firstName", label: "Nombre" },
  { name: "lastName", label: "Apellidos" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Teléfono", type: "tel" },
  { name: "dni", label: "DNI" },
  { name: "dateOfBirth", label: "Fecha de nacimiento", type: "date" },
  { name: "address", label: "Dirección" },
  { name: "city", label: "Ciudad" },
  { name: "postalCode", label: "Código postal" },
  { name: "province", label: "Provincia" },
];

export function RegistrationFormFields({ registration = {} }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {FIELDS.map(({ name, label, type }) => (
        <div key={name} className="space-y-1">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            name={name}
            type={type ?? "text"}
            defaultValue={registration[name]?.toString() ?? ""}
            required
          />
        </div>
      ))}
    </div>
  );
}
