import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockSessionCreate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    federationType: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
    registration: {
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        create: (...args: unknown[]) => mockSessionCreate(...args),
      },
    },
  }),
}));

vi.mock("@/lib/settings", () => ({
  getMembershipFee: () => Promise.resolve(2000),
}));

function createRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = {
  firstName: "Juan",
  lastName: "García",
  email: "juan@test.com",
  phone: "612345678",
  dni: "12345678A",
  dateOfBirth: "1990-01-15",
  address: "Calle Mayor 1",
  city: "Madrid",
  postalCode: "28001",
  province: "Madrid",
  federationTypeId: "fed-1",
  federationSubtypeId: "sub-1",
  categoryId: "cat-1",
  supplementIds: ["sup-1"],
};

const mockFederation = {
  id: "fed-1",
  name: "Nacional",
  description: "Federativa nacional",
  active: true,
  subtypes: [
    {
      id: "sub-1",
      name: "Basica",
      description: "Modalidad básica",
      active: true,
      federationTypeId: "fed-1",
    },
  ],
  categories: [
    {
      id: "cat-1",
      name: "Adulto",
      description: "Categoría adulto",
      active: true,
      federationTypeId: "fed-1",
      prices: [{ id: "cp-1", categoryId: "cat-1", subtypeId: "sub-1", price: 4500 }],
    },
  ],
  supplements: [
    {
      id: "sup-1",
      name: "Seguro extra",
      description: "Seguro adicional",
      price: 1000,
      active: true,
      federationTypeId: "fed-1",
      supplementGroupId: null,
      supplementGroup: null,
    },
  ],
  supplementGroups: [],
};

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("returns 400 for invalid data", async () => {
    const request = createRequest({ firstName: "" });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Datos de registro inválidos");
  });

  it("returns 400 when federation type not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const request = createRequest(validBody);
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Tipo de federativa no encontrado");
  });

  it("returns 400 when subtype not found", async () => {
    mockFindUnique.mockResolvedValue({
      ...mockFederation,
      subtypes: [],
    });

    const request = createRequest(validBody);
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Subtipo de federativa no encontrado");
  });

  it("returns 400 for invalid supplements", async () => {
    mockFindUnique.mockResolvedValue({
      ...mockFederation,
      supplements: [],
    });

    const request = createRequest(validBody);
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Suplementos inválidos para esta federativa");
  });

  it("creates registration and returns Stripe session URL", async () => {
    mockFindUnique.mockResolvedValue(mockFederation);
    mockCreate.mockResolvedValue({ id: "reg-123" });
    mockUpdate.mockResolvedValue({});
    mockSessionCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });

    const request = createRequest(validBody);
    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toBe("https://checkout.stripe.com/pay/cs_test_123");

    // Total: category 4500 + membership 2000 + supplement 1000 = 7500
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalAmount: 7500,
          paymentStatus: "PENDING",
          email: "juan@test.com",
          federationSubtypeId: "sub-1",
          categoryId: "cat-1",
        }),
      }),
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "reg-123" },
      data: { stripeSessionId: "cs_test_123" },
    });
  });

  it("returns 502 and marks registration FAILED when Stripe throws", async () => {
    mockFindUnique.mockResolvedValue(mockFederation);
    mockCreate.mockResolvedValue({ id: "reg-err" });
    mockUpdate.mockResolvedValue({});
    mockSessionCreate.mockRejectedValue(
      new Error("Invalid API Key provided: sk_test_REPLACE_ME"),
    );

    const request = createRequest(validBody);
    const response = await POST(request);

    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toContain("Error al conectar con la pasarela de pago");
    expect(data.error).toContain("Invalid API Key");

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "reg-err" },
      data: { paymentStatus: "FAILED" },
    });
  });

  it("creates registration without supplements", async () => {
    const bodyNoSupplements = { ...validBody, supplementIds: [] };
    mockFindUnique.mockResolvedValue(mockFederation);
    mockCreate.mockResolvedValue({ id: "reg-456" });
    mockUpdate.mockResolvedValue({});
    mockSessionCreate.mockResolvedValue({
      id: "cs_test_456",
      url: "https://checkout.stripe.com/pay/cs_test_456",
    });

    const request = createRequest(bodyNoSupplements);
    const response = await POST(request);

    expect(response.status).toBe(200);

    // Total: category 4500 + membership 2000 = 6500
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ totalAmount: 6500 }),
      }),
    );
  });
});
