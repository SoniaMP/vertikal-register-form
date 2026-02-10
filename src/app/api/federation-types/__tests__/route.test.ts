import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

const mockFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    federationType: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

describe("GET /api/federation-types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns active federation types with subtypes and supplements", async () => {
    const mockData = [
      {
        id: "1",
        name: "Nacional",
        description: "Federativa nacional",
        active: true,
        subtypes: [
          { id: "st1", name: "Basica", price: 4500, active: true },
        ],
        supplements: [
          { id: "s1", name: "Seguro", price: 1000, active: true },
        ],
      },
    ];

    mockFindMany.mockResolvedValue(mockData);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockData);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { active: true },
      include: {
        subtypes: {
          where: { active: true },
          orderBy: { price: "asc" },
        },
        supplements: {
          where: { active: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
  });

  it("returns empty array when no active types exist", async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual([]);
  });
});
