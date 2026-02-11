import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MemberFormData } from "./member-form-dialog";

type Props = {
  defaults?: Partial<MemberFormData>;
};

const FIELDS: {
  name: keyof MemberFormData;
  label: string;
  type?: string;
}[] = [
  { name: "firstName", label: "Nombre" },
  { name: "lastName", label: "Apellidos" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Telefono", type: "tel" },
  { name: "dni", label: "DNI" },
  { name: "dateOfBirth", label: "Fecha de nacimiento", type: "date" },
  { name: "address", label: "Direccion" },
  { name: "city", label: "Ciudad" },
  { name: "postalCode", label: "Codigo postal" },
  { name: "province", label: "Provincia" },
];

export function MemberFormFields({ defaults = {} }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {FIELDS.map(({ name, label, type }) => (
        <div key={name} className="space-y-1">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            name={name}
            type={type ?? "text"}
            defaultValue={defaults[name]?.toString() ?? ""}
            required
          />
        </div>
      ))}
    </div>
  );
}
