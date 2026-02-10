import { describe, it, expect } from "vitest";
import {
  federationTypeSchema,
  federationSubtypeSchema,
  supplementSchema,
} from "../federation-type";

const validFederationType = {
  name: "Federativa básica",
  description: "Federativa para principiantes",
};

const validSubtype = {
  name: "Básica 45",
  description: "Modalidad básica estándar",
  price: 4500,
};

const validSupplement = {
  name: "Seguro adicional",
  description: "Seguro deportivo extra",
  price: 1500,
};

describe("federationTypeSchema", () => {
  it("accepts valid federation type data (no price)", () => {
    const result = federationTypeSchema.safeParse(validFederationType);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = federationTypeSchema.safeParse({
      ...validFederationType,
      name: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = federationTypeSchema.safeParse({
      ...validFederationType,
      description: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("ignores extra price field", () => {
    const result = federationTypeSchema.safeParse({
      ...validFederationType,
      price: 4500,
    });
    expect(result.success).toBe(true);
  });

  it("returns Spanish error messages for name", () => {
    const result = federationTypeSchema.safeParse({
      ...validFederationType,
      name: "A",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error?.message).toBe(
        "El nombre debe tener al menos 2 caracteres",
      );
    }
  });
});

describe("federationSubtypeSchema", () => {
  it("accepts valid subtype data", () => {
    const result = federationSubtypeSchema.safeParse(validSubtype);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = federationSubtypeSchema.safeParse({
      ...validSubtype,
      name: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = federationSubtypeSchema.safeParse({
      ...validSubtype,
      description: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero price", () => {
    const result = federationSubtypeSchema.safeParse({
      ...validSubtype,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = federationSubtypeSchema.safeParse({
      ...validSubtype,
      price: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer price", () => {
    const result = federationSubtypeSchema.safeParse({
      ...validSubtype,
      price: 45.5,
    });
    expect(result.success).toBe(false);
  });

  it("returns Spanish error messages for price", () => {
    const result = federationSubtypeSchema.safeParse({
      ...validSubtype,
      price: -1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("price"));
      expect(error?.message).toBe("El precio debe ser mayor que 0");
    }
  });
});

describe("supplementSchema", () => {
  it("accepts valid supplement data", () => {
    const result = supplementSchema.safeParse(validSupplement);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = supplementSchema.safeParse({
      ...validSupplement,
      name: "X",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = supplementSchema.safeParse({
      ...validSupplement,
      description: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero price", () => {
    const result = supplementSchema.safeParse({
      ...validSupplement,
      price: 0,
    });
    expect(result.success).toBe(false);
  });
});
