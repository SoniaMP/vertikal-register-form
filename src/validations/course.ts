import { z } from "zod";

export const courseTypeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
});

export type CourseTypeInput = z.infer<typeof courseTypeSchema>;

export const courseCatalogSchema = z.object({
  title: z.string().default(""),
  courseDate: z.coerce.date().nullable().default(null),
  courseTypeId: z.string().default(""),
  address: z.string().default(""),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  placeId: z.string().nullable().optional(),
  description: z.string().default(""),
  maxCapacity: z
    .number()
    .int({ message: "La capacidad debe ser un número entero" })
    .positive({ message: "La capacidad debe ser mayor que 0" })
    .nullable()
    .default(null),
  image: z.string().nullable().optional(),
});

export type CourseCatalogInput = z.infer<typeof courseCatalogSchema>;

export const coursePriceEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "El nombre del precio es obligatorio" }),
  amountCents: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .nonnegative({ message: "El precio no puede ser negativo" }),
});

export type CoursePriceEntryInput = z.infer<typeof coursePriceEntrySchema>;

export const coursePriceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  amountCents: z
    .number()
    .int({ message: "El precio debe ser un número entero (céntimos)" })
    .positive({ message: "El precio debe ser mayor que 0" }),
  saleStart: z.coerce.date().nullable().optional(),
  saleEnd: z.coerce.date().nullable().optional(),
});

export type CoursePriceInput = z.infer<typeof coursePriceSchema>;

export const courseRegistrationCheckoutSchema = z.object({
  courseCatalogId: z
    .string()
    .min(1, { message: "El curso es obligatorio" }),
  coursePriceId: z
    .string()
    .min(1, { message: "El precio es obligatorio" }),
  firstName: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  email: z
    .string()
    .email({ message: "El email no es válido" }),
  phone: z.string().nullable().optional(),
});

export type CourseRegistrationCheckoutInput = z.infer<
  typeof courseRegistrationCheckoutSchema
>;
