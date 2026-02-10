import { describe, it, expect } from "vitest";
import { calculateTotal, formatPrice } from "../price-calculator";
import type { FederationSubtype, Supplement } from "@/types";

const baseSubtype: FederationSubtype = {
  id: "sub1",
  name: "Basica",
  description: "Licencia basica",
  price: 4500,
  active: true,
  federationTypeId: "fed1",
};

const supplementA: Supplement = {
  id: "sup1",
  name: "Seguro accidentes premium",
  description: "Cobertura ampliada",
  price: 1500,
  active: true,
  federationTypeId: "fed1",
};

const supplementB: Supplement = {
  id: "sup2",
  name: "Seguro responsabilidad civil",
  description: "RC deportiva",
  price: 1000,
  active: true,
  federationTypeId: "fed1",
};

describe("calculateTotal", () => {
  it("returns subtype price with no supplements", () => {
    const result = calculateTotal(baseSubtype, []);
    expect(result).toEqual({
      subtypeName: "Basica",
      subtypePrice: 4500,
      supplements: [],
      total: 4500,
    });
  });

  it("adds single supplement to total", () => {
    const result = calculateTotal(baseSubtype, [supplementA]);
    expect(result.total).toBe(6000);
    expect(result.supplements).toHaveLength(1);
    expect(result.supplements[0]).toEqual({
      name: "Seguro accidentes premium",
      price: 1500,
    });
  });

  it("adds multiple supplements to total", () => {
    const result = calculateTotal(baseSubtype, [
      supplementA,
      supplementB,
    ]);
    expect(result.total).toBe(7000);
    expect(result.supplements).toHaveLength(2);
  });

  it("returns correct breakdown structure", () => {
    const result = calculateTotal(baseSubtype, [supplementA]);
    expect(result.subtypeName).toBe("Basica");
    expect(result.subtypePrice).toBe(4500);
    expect(result.total).toBe(
      result.subtypePrice +
        result.supplements.reduce((sum, s) => sum + s.price, 0),
    );
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
