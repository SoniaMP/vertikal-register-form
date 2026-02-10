import { z } from "zod";

const SPANISH_DNI_REGEX = /^\d{8}[A-Za-z]$/;
const SPANISH_PHONE_REGEX = /^(\+34)?[6-9]\d{8}$/;
const SPANISH_POSTAL_CODE_REGEX = /^\d{5}$/;

export const personalDataSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z
    .string()
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Introduce un email válido" }),
  phone: z
    .string()
    .regex(SPANISH_PHONE_REGEX, {
      message: "Introduce un teléfono válido (ej: 612345678)",
    }),
  dni: z
    .string()
    .regex(SPANISH_DNI_REGEX, {
      message: "Introduce un DNI válido (ej: 12345678A)",
    }),
  dateOfBirth: z
    .string()
    .min(1, { message: "La fecha de nacimiento es obligatoria" }),
  address: z
    .string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  city: z
    .string()
    .min(2, { message: "La ciudad debe tener al menos 2 caracteres" }),
  postalCode: z
    .string()
    .regex(SPANISH_POSTAL_CODE_REGEX, {
      message: "Introduce un código postal válido (5 dígitos)",
    }),
  province: z
    .string()
    .min(2, { message: "La provincia debe tener al menos 2 caracteres" }),
});

export const federationSelectionSchema = z.object({
  federationTypeId: z
    .string()
    .min(1, { message: "Selecciona un tipo de federativa" }),
  federationSubtypeId: z
    .string()
    .min(1, { message: "Selecciona un subtipo de federativa" }),
  categoryId: z
    .string()
    .min(1, { message: "Selecciona una categoría" }),
  supplementIds: z.array(z.string()),
});

export const registrationSchema = personalDataSchema.merge(
  federationSelectionSchema,
);

export type PersonalDataInput = z.infer<typeof personalDataSchema>;
export type FederationSelectionInput = z.infer<
  typeof federationSelectionSchema
>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
