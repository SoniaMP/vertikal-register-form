/**
 * MSW Handlers for Stripe API
 * Mocks Stripe endpoints for payment processing
 */

import { http, HttpResponse, delay } from "msw";

const API_BASE = "/api/stripe";

// License prices in cents (60€ for all licenses)
const DEFAULT_LICENSE_PRICE = 6000;

// Club fee in cents
const CLUB_FEE = 2000;

// Generate price data for a license type
function generatePriceData(licenseType: string) {
  return {
    id: `price_${licenseType.toLowerCase().replace(/\s+/g, "_")}_mock`,
    object: "price",
    active: true,
    currency: "eur",
    unit_amount: DEFAULT_LICENSE_PRICE,
    product: `prod_${licenseType.toLowerCase().replace(/\s+/g, "_")}_mock`,
    type: "one_time",
  };
}

// Generate payment intent
function generatePaymentIntent(amount: number, currency: string = "eur") {
  const id = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return {
    id,
    object: "payment_intent",
    amount,
    currency,
    status: "requires_payment_method",
    client_secret: `${id}_secret_mock`,
    created: Math.floor(Date.now() / 1000),
    livemode: false,
  };
}

export const stripeHandlers = [
  // GET /api/stripe/prices/:licenseType - Get price for a license
  http.get(`${API_BASE}/prices/:licenseType`, async ({ params }) => {
    await delay(300);

    const { licenseType } = params as { licenseType: string };

    if (!licenseType) {
      return HttpResponse.json(
        { error: { message: "License type is required" } },
        { status: 400 }
      );
    }

    return HttpResponse.json(generatePriceData(licenseType));
  }),

  // GET /api/stripe/club-fee - Get club fee
  http.get(`${API_BASE}/club-fee`, async () => {
    await delay(100);

    return HttpResponse.json({
      amount: CLUB_FEE,
      currency: "eur",
      formatted: `${CLUB_FEE / 100}€`,
    });
  }),

  // POST /api/stripe/calculate-total - Calculate total price
  http.post(`${API_BASE}/calculate-total`, async ({ request }) => {
    await delay(200);

    const data = (await request.json()) as {
      licenseType: string;
      complements?: { key: string; price: number }[];
      printPhysicalCard?: boolean;
      physicalCardPrice?: number;
    };

    const licensePrice = DEFAULT_LICENSE_PRICE / 100;
    const clubFee = CLUB_FEE / 100;
    const complementsTotal = (data.complements || []).reduce(
      (sum, c) => sum + c.price,
      0
    );
    const cardPrice = data.printPhysicalCard ? data.physicalCardPrice || 0 : 0;

    return HttpResponse.json({
      licensePrice,
      clubFee,
      complementsTotal,
      physicalCardPrice: cardPrice,
      total: licensePrice + clubFee + complementsTotal + cardPrice,
      breakdown: {
        licensePrice: { amount: licensePrice, label: "Licencia" },
        clubFee: { amount: clubFee, label: "Cuota del club" },
        complementsTotal: { amount: complementsTotal, label: "Complementos" },
        physicalCardPrice: { amount: cardPrice, label: "Tarjeta física" },
      },
    });
  }),

  // POST /api/stripe/payment-intents - Create payment intent
  http.post(`${API_BASE}/payment-intents`, async ({ request }) => {
    await delay(500);

    const data = (await request.json()) as {
      amount: number;
      currency?: string;
      metadata?: Record<string, string>;
    };

    if (!data.amount || data.amount <= 0) {
      return HttpResponse.json(
        {
          error: {
            type: "invalid_request_error",
            message: "Amount must be a positive integer",
          },
        },
        { status: 400 }
      );
    }

    const paymentIntent = generatePaymentIntent(data.amount, data.currency);

    return HttpResponse.json(paymentIntent, { status: 201 });
  }),

  // POST /api/stripe/payment-intents/:id/confirm - Confirm payment intent
  http.post(`${API_BASE}/payment-intents/:id/confirm`, async ({ params }) => {
    await delay(800);

    const { id } = params as { id: string };

    // Simulate successful payment
    return HttpResponse.json({
      id,
      object: "payment_intent",
      status: "succeeded",
      amount_received: 8000, // Example amount
      currency: "eur",
      created: Math.floor(Date.now() / 1000),
      livemode: false,
    });
  }),

  // GET /api/stripe/payment-intents/:id - Get payment intent status
  http.get(`${API_BASE}/payment-intents/:id`, async ({ params }) => {
    await delay(200);

    const { id } = params as { id: string };

    return HttpResponse.json({
      id,
      object: "payment_intent",
      status: "succeeded",
      amount: 8000,
      currency: "eur",
      created: Math.floor(Date.now() / 1000),
      livemode: false,
    });
  }),

  // POST /api/stripe/webhooks - Webhook endpoint (for testing)
  http.post(`${API_BASE}/webhooks`, async ({ request }) => {
    await delay(100);

    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Log webhook for debugging
    console.log("[MSW] Stripe webhook received:", {
      signature,
      payloadLength: payload.length,
    });

    return HttpResponse.json({ received: true });
  }),
];
