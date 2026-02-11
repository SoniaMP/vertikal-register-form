import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    appSetting: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

import { getMembershipFee } from "../settings";

describe("getMembershipFee", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns default when no setting exists", async () => {
    mockFindUnique.mockResolvedValue(null);
    expect(await getMembershipFee()).toBe(2000);
  });

  it("returns stored value when valid", async () => {
    mockFindUnique.mockResolvedValue({ key: "MEMBERSHIP_FEE", value: "3500" });
    expect(await getMembershipFee()).toBe(3500);
  });

  it("returns default for non-numeric value", async () => {
    mockFindUnique.mockResolvedValue({ key: "MEMBERSHIP_FEE", value: "abc" });
    expect(await getMembershipFee()).toBe(2000);
  });
});
