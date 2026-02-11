import { describe, it, expect } from "vitest";
import {
  inferMembershipStatus,
  normalizeDni,
} from "../migration-helpers";

describe("inferMembershipStatus", () => {
  it("returns ACTIVE when active and payment COMPLETED", () => {
    expect(
      inferMembershipStatus({ active: true, paymentStatus: "COMPLETED" }),
    ).toBe("ACTIVE");
  });

  it("returns PENDING_PAYMENT when active and payment PENDING", () => {
    expect(
      inferMembershipStatus({ active: true, paymentStatus: "PENDING" }),
    ).toBe("PENDING_PAYMENT");
  });

  it("returns CANCELLED when active and payment REFUNDED", () => {
    expect(
      inferMembershipStatus({ active: true, paymentStatus: "REFUNDED" }),
    ).toBe("CANCELLED");
  });

  it("returns CANCELLED when active and payment FAILED", () => {
    expect(
      inferMembershipStatus({ active: true, paymentStatus: "FAILED" }),
    ).toBe("CANCELLED");
  });

  it("returns CANCELLED when not active regardless of payment status", () => {
    expect(
      inferMembershipStatus({ active: false, paymentStatus: "COMPLETED" }),
    ).toBe("CANCELLED");
    expect(
      inferMembershipStatus({ active: false, paymentStatus: "PENDING" }),
    ).toBe("CANCELLED");
    expect(
      inferMembershipStatus({ active: false, paymentStatus: "FAILED" }),
    ).toBe("CANCELLED");
    expect(
      inferMembershipStatus({ active: false, paymentStatus: "REFUNDED" }),
    ).toBe("CANCELLED");
  });
});

describe("normalizeDni", () => {
  it("uppercases lowercase input", () => {
    expect(normalizeDni("12345678a")).toBe("12345678A");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeDni("  12345678A  ")).toBe("12345678A");
  });

  it("handles already normalized input", () => {
    expect(normalizeDni("12345678A")).toBe("12345678A");
  });

  it("handles mixed case and whitespace", () => {
    expect(normalizeDni(" x1234567b ")).toBe("X1234567B");
  });

  it("handles empty string", () => {
    expect(normalizeDni("")).toBe("");
  });
});
