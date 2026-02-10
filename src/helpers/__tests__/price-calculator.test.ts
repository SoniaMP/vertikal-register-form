import { describe, it, expect } from "vitest";
import { calculateTotal, formatPrice } from "../price-calculator";
import type { Supplement } from "@/types";

const supplementA: Supplement = {
  id: "sup1",
  name: "Seguro accidentes premium",
  description: "Cobertura ampliada",
  price: 1500,
  active: true,
  federationTypeId: "fed1",
  supplementGroupId: null,
  supplementGroup: null,
};

const supplementB: Supplement = {
  id: "sup2",
  name: "Seguro responsabilidad civil",
  description: "RC deportiva",
  price: 1000,
  active: true,
  federationTypeId: "fed1",
  supplementGroupId: null,
  supplementGroup: null,
};

const groupedSupplement: Supplement = {
  id: "sup3",
  name: "Seguro grupo A",
  description: "Parte del grupo",
  price: null,
  active: true,
  federationTypeId: "fed1",
  supplementGroupId: "grp1",
  supplementGroup: {
    id: "grp1",
    name: "Pack Seguros",
    price: 2000,
    federationTypeId: "fed1",
  },
};

describe("calculateTotal", () => {
  it("returns category price + membership fee with no supplements", () => {
    const result = calculateTotal("Adulto", 4500, [], 2000);
    expect(result).toEqual({
      categoryName: "Adulto",
      categoryPrice: 4500,
      membershipFee: 2000,
      supplements: [],
      total: 6500,
    });
  });

  it("adds single supplement to total", () => {
    const result = calculateTotal("Adulto", 4500, [supplementA], 2000);
    expect(result.total).toBe(8000);
    expect(result.supplements).toHaveLength(1);
    expect(result.supplements[0]).toEqual({
      name: "Seguro accidentes premium",
      price: 1500,
      isGroup: false,
    });
  });

  it("adds multiple supplements to total", () => {
    const result = calculateTotal(
      "Adulto",
      4500,
      [supplementA, supplementB],
      2000,
    );
    expect(result.total).toBe(9000);
    expect(result.supplements).toHaveLength(2);
  });

  it("charges group price once for grouped supplements", () => {
    const result = calculateTotal(
      "Adulto",
      4500,
      [groupedSupplement],
      2000,
    );
    expect(result.total).toBe(8500);
    expect(result.supplements).toHaveLength(1);
    expect(result.supplements[0]).toEqual({
      name: "Pack Seguros",
      price: 2000,
      isGroup: true,
    });
  });

  it("includes membership fee in breakdown", () => {
    const result = calculateTotal("Infantil", 3000, [supplementA], 1500);
    expect(result.membershipFee).toBe(1500);
    expect(result.total).toBe(3000 + 1500 + 1500);
  });
});

describe("formatPrice", () => {
  it("formats cents as EUR with comma decimal", () => {
    const result = formatPrice(4500);
    expect(result).toMatch(/45,00/);
    expect(result).toMatch(/€/);
  });

  it("formats zero correctly", () => {
    const result = formatPrice(0);
    expect(result).toMatch(/0,00/);
  });

  it("formats large amounts", () => {
    const result = formatPrice(12345);
    expect(result).toMatch(/123,45/);
  });

  it("formats single digit cents", () => {
    const result = formatPrice(5);
    expect(result).toMatch(/0,05/);
  });
});
