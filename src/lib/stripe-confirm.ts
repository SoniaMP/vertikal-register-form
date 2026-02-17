import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * Verify a Stripe checkout session and mark the related record as paid.
 * Safe to call multiple times (idempotent).
 * Returns true when the session was paid successfully.
 */
export async function confirmCourseCheckout(
  sessionId: string,
): Promise<boolean> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") return false;

  const registrationId = session.metadata?.courseRegistrationId;
  if (!registrationId) return false;

  await prisma.courseRegistration.update({
    where: { id: registrationId },
    data: {
      paymentStatus: "COMPLETED",
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
    },
  });

  return true;
}

export async function confirmMembershipCheckout(
  sessionId: string,
): Promise<boolean> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") return false;

  const membershipId = session.metadata?.membershipId;
  if (!membershipId) return false;

  await prisma.membership.update({
    where: { id: membershipId },
    data: {
      paymentStatus: "COMPLETED",
      status: "ACTIVE",
      stripePaymentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
    },
  });

  return true;
}
