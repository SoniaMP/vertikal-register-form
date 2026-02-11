import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

const mockFetchLicenseCatalog = vi.fn();

vi.mock("@/lib/license-catalog", () => ({
  fetchLicenseCatalog: (...args: unknown[]) => mockFetchLicenseCatalog(...args),
}));

describe("GET /api/federation-types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the license catalog", async () => {
    const mockCatalog = [
      {
        id: "1",
        name: "Nacional",
        description: "Federativa nacional",
        active: true,
        subtypes: [
          { id: "st1", name: "Basica", description: null, active: true, licenseTypeId: "1" },
        ],
        categories: [
          { id: "cat1", name: "Adulto", description: null, active: true, prices: [] },
        ],
        supplements: [],
        supplementGroups: [],
      },
    ];

    mockFetchLicenseCatalog.mockResolvedValue(mockCatalog);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCatalog);
    expect(mockFetchLicenseCatalog).toHaveBeenCalledOnce();
  });

  it("returns empty array when no active types exist", async () => {
    mockFetchLicenseCatalog.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual([]);
  });
});
