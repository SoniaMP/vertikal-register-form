import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCount = vi.fn();
const mockDelete = vi.fn();
const mockDeleteMany = vi.fn();
const mockTransaction = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    registration: { count: (...args: unknown[]) => mockCount(...args) },
    categoryPrice: { deleteMany: (...args: unknown[]) => mockDeleteMany(...args) },
    category: { deleteMany: (...args: unknown[]) => mockDeleteMany(...args) },
    supplement: { deleteMany: (...args: unknown[]) => mockDeleteMany(...args) },
    supplementGroup: { deleteMany: (...args: unknown[]) => mockDeleteMany(...args) },
    federationSubtype: { deleteMany: (...args: unknown[]) => mockDeleteMany(...args) },
    federationType: { delete: (...args: unknown[]) => mockDelete(...args) },
    $transaction: (fn: (tx: unknown) => Promise<void>) => mockTransaction(fn),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: "admin" } }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deleteFederationType", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        categoryPrice: { deleteMany: mockDeleteMany },
        category: { deleteMany: mockDeleteMany },
        supplement: { deleteMany: mockDeleteMany },
        supplementGroup: { deleteMany: mockDeleteMany },
        federationSubtype: { deleteMany: mockDeleteMany },
        federationType: { delete: mockDelete },
      };
      return fn(tx);
    });
  });

  it("deletes federation type when no registrations exist", async () => {
    const { deleteFederationType } = await import("../federation-type-actions");
    mockCount.mockResolvedValue(0);

    const result = await deleteFederationType("ft-1");

    expect(result).toEqual({ success: true });
    expect(mockCount).toHaveBeenCalledWith({
      where: { federationTypeId: "ft-1" },
    });
    expect(mockTransaction).toHaveBeenCalled();
  });

  it("returns error when registrations exist", async () => {
    const { deleteFederationType } = await import("../federation-type-actions");
    mockCount.mockResolvedValue(3);

    const result = await deleteFederationType("ft-2");

    expect(result).toEqual({
      success: false,
      error: "No se puede eliminar: tiene registros asociados",
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });
});
