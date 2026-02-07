import { describe, it, expect } from "vitest";
import {
  personalDataSchema,
  federationSelectionSchema,
  registrationSchema,
} from "../registration";

const validPersonalData = {
  firstName: "Juan",
  lastName: "Garcia Lopez",
  email: "juan@example.com",
  phone: "612345678",
  dni: "12345678A",
  dateOfBirth: "1990-01-15",
  address: "Calle Mayor 10",
  city: "Madrid",
  postalCode: "28001",
  province: "Madrid",
};

describe("personalDataSchema", () => {
  it("accepts valid personal data", () => {
    const result = personalDataSchema.safeParse(validPersonalData);
    expect(result.success).toBe(true);
  });

  it("accepts phone with +34 prefix", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      phone: "+34612345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short first name", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      firstName: "J",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone number", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      phone: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects phone starting with non-6-9 digit", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      phone: "512345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid DNI format", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      dni: "1234567",
    });
    expect(result.success).toBe(false);
  });

  it("rejects DNI without letter", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      dni: "123456789",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid postal code", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      postalCode: "1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty date of birth", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      dateOfBirth: "",
    });
    expect(result.success).toBe(false);
  });

  it("returns Spanish error messages", () => {
    const result = personalDataSchema.safeParse({
      ...validPersonalData,
      firstName: "J",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) =>
        i.path.includes("firstName"),
      );
      expect(nameError?.message).toBe(
        "El nombre debe tener al menos 2 caracteres",
      );
    }
  });
});

describe("federationSelectionSchema", () => {
  it("accepts valid selection with supplements", () => {
    const result = federationSelectionSchema.safeParse({
      federationTypeId: "abc123",
      supplementIds: ["sup1", "sup2"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts selection without supplements", () => {
    const result = federationSelectionSchema.safeParse({
      federationTypeId: "abc123",
      supplementIds: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty federation type id", () => {
    const result = federationSelectionSchema.safeParse({
      federationTypeId: "",
      supplementIds: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("registrationSchema", () => {
  it("accepts complete valid registration", () => {
    const result = registrationSchema.safeParse({
      ...validPersonalData,
      federationTypeId: "fed1",
      supplementIds: ["sup1"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects registration missing federation type", () => {
    const result = registrationSchema.safeParse({
      ...validPersonalData,
      supplementIds: ["sup1"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects registration with invalid personal data", () => {
    const result = registrationSchema.safeParse({
      ...validPersonalData,
      email: "bad",
      federationTypeId: "fed1",
      supplementIds: [],
    });
    expect(result.success).toBe(false);
  });
});
