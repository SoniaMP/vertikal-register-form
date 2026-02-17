import { describe, it, expect, vi, beforeEach } from "vitest";
import { confirmCourseCheckout, confirmMembershipCheckout } from "../stripe-confirm";

const mockSessionRetrieve = vi.fn();
const mockCourseRegistrationUpdate = vi.fn();
const mockMembershipUpdate = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        retrieve: (...args: unknown[]) => mockSessionRetrieve(...args),
      },
    },
  }),
}));

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

describe("confirmCourseCheckout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns false when payment_status is not paid", async () => {
    mockSessionRetrieve.mockResolvedValue({
      payment_status: "unpaid",
      metadata: { courseRegistrationId: "creg-1" },
    });

    expect(await confirmCourseCheckout("cs_123")).toBe(false);
    expect(mockCourseRegistrationUpdate).not.toHaveBeenCalled();
  });

  it("returns false when metadata has no courseRegistrationId", async () => {
    mockSessionRetrieve.mockResolvedValue({
      payment_status: "paid",
      metadata: {},
    });

    expect(await confirmCourseCheckout("cs_123")).toBe(false);
    expect(mockCourseRegistrationUpdate).not.toHaveBeenCalled();
  });

  it("updates registration and returns true on success", async () => {
    mockSessionRetrieve.mockResolvedValue({
      payment_status: "paid",
      metadata: { courseRegistrationId: "creg-1" },
      payment_intent: "pi_abc",
    });
    mockCourseRegistrationUpdate.mockResolvedValue({});

    expect(await confirmCourseCheckout("cs_123")).toBe(true);
    expect(mockCourseRegistrationUpdate).toHaveBeenCalledWith({
      where: { id: "creg-1" },
      data: {
        paymentStatus: "COMPLETED",
        stripePaymentIntentId: "pi_abc",
      },
    });
  });
});

describe("confirmMembershipCheckout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns false when payment_status is not paid", async () => {
    mockSessionRetrieve.mockResolvedValue({
      payment_status: "unpaid",
      metadata: { membershipId: "ms-1" },
    });

    expect(await confirmMembershipCheckout("cs_456")).toBe(false);
    expect(mockMembershipUpdate).not.toHaveBeenCalled();
  });

  it("updates membership and returns true on success", async () => {
    mockSessionRetrieve.mockResolvedValue({
      payment_status: "paid",
      metadata: { membershipId: "ms-1" },
      payment_intent: "pi_xyz",
    });
    mockMembershipUpdate.mockResolvedValue({});

    expect(await confirmMembershipCheckout("cs_456")).toBe(true);
    expect(mockMembershipUpdate).toHaveBeenCalledWith({
      where: { id: "ms-1" },
      data: {
        paymentStatus: "COMPLETED",
        status: "ACTIVE",
        stripePaymentId: "pi_xyz",
      },
    });
  });
});
