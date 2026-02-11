import { z } from "zod";

export const licenseTypeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
});

export type LicenseTypeInput = z.infer<typeof licenseTypeSchema>;

export const licenseSubtypeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
});

export type LicenseSubtypeInput = z.infer<typeof licenseSubtypeSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().optional().default(""),
});

export type CategoryInput = z.infer<typeof categorySchema>;

const offeringEntrySchema = z.object({
  subtypeId: z.string().min(1, { message: "El subtipo es obligatorio" }),
  categoryId: z.string().min(1, { message: "La categoría es obligatoria" }),
  price: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" }),
});

export const offeringPriceSchema = z.object({
  seasonId: z.string().min(1, { message: "La temporada es obligatoria" }),
  typeId: z.string().min(1, { message: "El tipo es obligatorio" }),
  entries: z.array(offeringEntrySchema),
});

export type OfferingPriceInput = z.infer<typeof offeringPriceSchema>;

export const supplementGroupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
});

export type SupplementGroupInput = z.infer<typeof supplementGroupSchema>;

export const supplementSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
  supplementGroupId: z.string().nullable(),
});

export type SupplementInput = z.infer<typeof supplementSchema>;

export const supplementPriceSchema = z.object({
  seasonId: z.string().min(1, { message: "La temporada es obligatoria" }),
  supplementId: z
    .string()
    .min(1, { message: "El suplemento es obligatorio" }),
  price: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" }),
});

export type SupplementPriceInput = z.infer<typeof supplementPriceSchema>;

export const supplementGroupPriceSchema = z.object({
  seasonId: z.string().min(1, { message: "La temporada es obligatoria" }),
  groupId: z.string().min(1, { message: "El grupo es obligatorio" }),
  price: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" }),
});

export type SupplementGroupPriceInput = z.infer<
  typeof supplementGroupPriceSchema
>;
