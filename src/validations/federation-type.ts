import { z } from "zod";

export const federationTypeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
});

export type FederationTypeInput = z.infer<typeof federationTypeSchema>;

export const federationSubtypeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
});

export type FederationSubtypeInput = z.infer<typeof federationSubtypeSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().optional().default(""),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const categoryPriceSchema = z.object({
  subtypeId: z.string().min(1, { message: "El subtipo es obligatorio" }),
  price: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" }),
});

export type CategoryPriceInput = z.infer<typeof categoryPriceSchema>;

export const supplementGroupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  price: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" }),
});

export type SupplementGroupInput = z.infer<typeof supplementGroupSchema>;

export const supplementSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
  price: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" })
    .nullable(),
  supplementGroupId: z.string().nullable(),
});

export type SupplementInput = z.infer<typeof supplementSchema>;
