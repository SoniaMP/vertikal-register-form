import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();
const mockDelete = vi.fn();
const mockDeleteMany = vi.fn();
const mockCount = vi.fn();
const mockMemberDelete = vi.fn();
const mockUpsert = vi.fn();
const mockCreate = vi.fn();
const mockTransaction = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    membership: { findUnique: (...a: unknown[]) => mockFindUnique(...a) },
    $transaction: (fn: (tx: unknown) => Promise<void>) => mockTransaction(fn),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: "admin" } }),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/settings", () => ({
  getActiveSeason: vi.fn().mockResolvedValue({ id: "season-1", name: "2025-2026" }),
}));

function buildTx() {
  return {
    membershipSupplement: { deleteMany: mockDeleteMany },
    membership: { delete: mockDelete, count: mockCount, create: mockCreate },
    member: { delete: mockMemberDelete, upsert: mockUpsert },
  };
}

describe("deleteMembership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransaction.mockImplementation(
      async (fn: (tx: unknown) => Promise<void>) => fn(buildTx()),
    );
  });

  it("deletes membership and member when no remaining memberships", async () => {
    const { deleteMembership } = await import("../membership-actions");
    mockFindUnique.mockResolvedValue({ memberId: "m-1" });
    mockCount.mockResolvedValue(0);

    const result = await deleteMembership("ms-1");

    expect(result).toEqual({ success: true });
    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { membershipId: "ms-1" } });
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "ms-1" } });
    expect(mockMemberDelete).toHaveBeenCalledWith({ where: { id: "m-1" } });
  });

  it("returns error when membership not found", async () => {
    const { deleteMembership } = await import("../membership-actions");
    mockFindUnique.mockResolvedValue(null);

    const result = await deleteMembership("missing");

    expect(result).toEqual({ success: false, error: "Membresía no encontrada" });
  });

  it("catches database errors gracefully", async () => {
    const { deleteMembership } = await import("../membership-actions");
    mockFindUnique.mockResolvedValue({ memberId: "m-1" });
    mockTransaction.mockRejectedValue(new Error("DB error"));

    const result = await deleteMembership("ms-1");

    expect(result).toEqual({ success: false, error: "Error al eliminar la membresía" });
  });
});

describe("createMemberWithMembership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpsert.mockResolvedValue({ id: "m-1" });
    mockTransaction.mockImplementation(
      async (fn: (tx: unknown) => Promise<void>) => fn(buildTx()),
    );
  });

  function buildFormData(overrides: Record<string, string | null> = {}): FormData {
    const defaults: Record<string, string> = {
      firstName: "Ana",
      lastName: "Garcia Lopez",
      email: "ana@example.com",
      phone: "612345678",
      dni: "12345678A",
      dateOfBirth: "1990-01-15",
      address: "Calle Mayor 10",
      city: "Madrid",
      postalCode: "28001",
      province: "Madrid",
      typeId: "ft-1",
      subtypeId: "fs-1",
      categoryId: "cat-1",
    };
    const merged = { ...defaults, ...overrides };
    const fd = new FormData();
    for (const [k, v] of Object.entries(merged)) {
      if (v !== null) fd.set(k, v);
    }
    return fd;
  }

  it("returns validation error for empty license type", async () => {
    const { createMemberWithMembership } = await import("../membership-actions");

    const result = await createMemberWithMembership(
      { success: false },
      buildFormData({ typeId: "" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Selecciona un tipo de licencia");
  });

  it("returns validation error when license type is missing (null)", async () => {
    const { createMemberWithMembership } = await import("../membership-actions");

    const result = await createMemberWithMembership(
      { success: false },
      buildFormData({ typeId: null }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Selecciona un tipo de licencia");
  });

  it("returns validation error for empty subtype", async () => {
    const { createMemberWithMembership } = await import("../membership-actions");

    const result = await createMemberWithMembership(
      { success: false },
      buildFormData({ subtypeId: "" }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Selecciona un subtipo");
  });

  it("catches database errors gracefully", async () => {
    const { createMemberWithMembership } = await import("../membership-actions");
    mockTransaction.mockRejectedValue(new Error("DB constraint error"));

    const result = await createMemberWithMembership(
      { success: false },
      buildFormData(),
    );

    expect(result).toEqual({ success: false, error: "Error al crear la membresía" });
  });

  it("creates membership with valid data", async () => {
    const { createMemberWithMembership } = await import("../membership-actions");

    const result = await createMemberWithMembership(
      { success: false },
      buildFormData(),
    );

    expect(result).toEqual({ success: true });
    expect(mockUpsert).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
  });
});
