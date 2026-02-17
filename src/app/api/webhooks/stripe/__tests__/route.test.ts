import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

const mockCourseRegistrationUpdate = vi.fn();
const mockMembershipUpdate = vi.fn();
const mockConstructEvent = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    courseRegistration: {
      update: (...args: unknown[]) => mockCourseRegistrationUpdate(...args),
    },
    membership: {
      update: (...args: unknown[]) => mockMembershipUpdate(...args),
    },
  },
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
    },
  }),
}));

function createRequest(body: string, signature?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (signature) headers["stripe-signature"] = signature;

  return new NextRequest("http://localhost:3000/api/webhooks/stripe", {
    method: "POST",
    body,
    headers,
  });
}

function makeCheckoutEvent(metadata: Record<string, string>) {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        metadata,
        payment_intent: "pi_test_abc",
      },
    },
  };
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await POST(createRequest("{}"));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Missing stripe-signature header");
  });

  it("returns 500 when STRIPE_WEBHOOK_SECRET is not set", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const res = await POST(createRequest("{}", "sig_test"));
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe("Webhook not configured");
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await POST(createRequest("{}", "sig_bad"));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid signature");
  });

  it("updates course registration to COMPLETED", async () => {
    const event = makeCheckoutEvent({ courseRegistrationId: "creg-1" });
    mockConstructEvent.mockReturnValue(event);
    mockCourseRegistrationUpdate.mockResolvedValue({});

    const res = await POST(createRequest("{}", "sig_ok"));
    expect(res.status).toBe(200);

    expect(mockCourseRegistrationUpdate).toHaveBeenCalledWith({
      where: { id: "creg-1" },
      data: {
        paymentStatus: "COMPLETED",
        stripePaymentIntentId: "pi_test_abc",
      },
    });
  });

  it("updates membership to COMPLETED and ACTIVE", async () => {
    const event = makeCheckoutEvent({ membershipId: "ms-1" });
    mockConstructEvent.mockReturnValue(event);
    mockMembershipUpdate.mockResolvedValue({});

    const res = await POST(createRequest("{}", "sig_ok"));
    expect(res.status).toBe(200);

    expect(mockMembershipUpdate).toHaveBeenCalledWith({
      where: { id: "ms-1" },
      data: {
        paymentStatus: "COMPLETED",
        status: "ACTIVE",
        stripePaymentId: "pi_test_abc",
      },
    });
  });

  it("ignores unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      data: { object: {} },
    });

    const res = await POST(createRequest("{}", "sig_ok"));
    expect(res.status).toBe(200);

    expect(mockCourseRegistrationUpdate).not.toHaveBeenCalled();
    expect(mockMembershipUpdate).not.toHaveBeenCalled();
  });
});
