import { describe, it, expect } from "vitest";
import {
  licenseTypeSchema,
  licenseSubtypeSchema,
  supplementSchema,
  offeringPriceSchema,
  supplementPriceSchema,
  supplementGroupPriceSchema,
  supplementGroupSchema,
} from "../license";

const validLicenseType = {
  name: "Federativa básica",
  description: "Federativa para principiantes",
};

const validSubtype = {
  name: "Básica 45",
  description: "Modalidad básica estándar",
};

const validSupplement = {
  name: "Seguro adicional",
  description: "Seguro deportivo extra",
  supplementGroupId: null,
};

const validOfferingPrice = {
  seasonId: "season-1",
  typeId: "type-1",
  entries: [
    { subtypeId: "sub-1", categoryId: "cat-1", price: 4500 },
  ],
};

const validSupplementPrice = {
  seasonId: "season-1",
  supplementId: "supp-1",
  price: 1500,
};

const validSupplementGroupPrice = {
  seasonId: "season-1",
  groupId: "group-1",
  price: 2000,
};

describe("licenseTypeSchema", () => {
  it("accepts valid license type data", () => {
    const result = licenseTypeSchema.safeParse(validLicenseType);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = licenseTypeSchema.safeParse({
      ...validLicenseType,
      name: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = licenseTypeSchema.safeParse({
      ...validLicenseType,
      description: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("ignores extra fields", () => {
    const result = licenseTypeSchema.safeParse({
      ...validLicenseType,
      price: 4500,
    });
    expect(result.success).toBe(true);
  });

  it("returns Spanish error messages for name", () => {
    const result = licenseTypeSchema.safeParse({
      ...validLicenseType,
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

describe("licenseSubtypeSchema", () => {
  it("accepts valid subtype data", () => {
    const result = licenseSubtypeSchema.safeParse(validSubtype);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = licenseSubtypeSchema.safeParse({
      ...validSubtype,
      name: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = licenseSubtypeSchema.safeParse({
      ...validSubtype,
      description: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("offeringPriceSchema", () => {
  it("accepts valid offering price data", () => {
    const result = offeringPriceSchema.safeParse(validOfferingPrice);
    expect(result.success).toBe(true);
  });

  it("accepts multiple entries", () => {
    const result = offeringPriceSchema.safeParse({
      ...validOfferingPrice,
      entries: [
        { subtypeId: "sub-1", categoryId: "cat-1", price: 4500 },
        { subtypeId: "sub-2", categoryId: "cat-1", price: 5000 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing seasonId", () => {
    const { seasonId: _, ...noSeason } = validOfferingPrice;
    const result = offeringPriceSchema.safeParse(noSeason);
    expect(result.success).toBe(false);
  });

  it("rejects missing typeId", () => {
    const { typeId: _, ...noType } = validOfferingPrice;
    const result = offeringPriceSchema.safeParse(noType);
    expect(result.success).toBe(false);
  });

  it("rejects zero price in entry", () => {
    const result = offeringPriceSchema.safeParse({
      ...validOfferingPrice,
      entries: [{ subtypeId: "sub-1", categoryId: "cat-1", price: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price in entry", () => {
    const result = offeringPriceSchema.safeParse({
      ...validOfferingPrice,
      entries: [{ subtypeId: "sub-1", categoryId: "cat-1", price: -100 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer price in entry", () => {
    const result = offeringPriceSchema.safeParse({
      ...validOfferingPrice,
      entries: [{ subtypeId: "sub-1", categoryId: "cat-1", price: 45.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("returns Spanish error messages for price", () => {
    const result = offeringPriceSchema.safeParse({
      ...validOfferingPrice,
      entries: [{ subtypeId: "sub-1", categoryId: "cat-1", price: -1 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("price"));
      expect(error?.message).toBe("El precio debe ser mayor que 0");
    }
  });
});

describe("supplementSchema", () => {
  it("accepts valid supplement data (no price field)", () => {
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
});

describe("supplementGroupSchema", () => {
  it("accepts valid group data (no price field)", () => {
    const result = supplementGroupSchema.safeParse({ name: "Grupo A" });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = supplementGroupSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });
});

describe("supplementPriceSchema", () => {
  it("accepts valid supplement price", () => {
    const result = supplementPriceSchema.safeParse(validSupplementPrice);
    expect(result.success).toBe(true);
  });

  it("rejects zero price", () => {
    const result = supplementPriceSchema.safeParse({
      ...validSupplementPrice,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing seasonId", () => {
    const { seasonId: _, ...noSeason } = validSupplementPrice;
    const result = supplementPriceSchema.safeParse(noSeason);
    expect(result.success).toBe(false);
  });
});

describe("supplementGroupPriceSchema", () => {
  it("accepts valid group price", () => {
    const result = supplementGroupPriceSchema.safeParse(
      validSupplementGroupPrice,
    );
    expect(result.success).toBe(true);
  });

  it("rejects zero price", () => {
    const result = supplementGroupPriceSchema.safeParse({
      ...validSupplementGroupPrice,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing groupId", () => {
    const { groupId: _, ...noGroup } = validSupplementGroupPrice;
    const result = supplementGroupPriceSchema.safeParse(noGroup);
    expect(result.success).toBe(false);
  });
});
