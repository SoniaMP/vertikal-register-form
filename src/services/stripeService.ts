/**
 * Stripe Service
 * Handles all Stripe-related API calls using fetch
 * Includes caching to prevent duplicate requests
 */

import { api } from "./api";
import { apiCache } from "./cache";

// Types
export interface PriceData {
  id: string;
  currency: string;
  unit_amount: number;
  product: string;
}

export interface PriceBreakdown {
  licensePrice: number;
  clubFee: number;
  complementsTotal: number;
  physicalCardPrice: number;
  total: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface ClubFeeResponse {
  amount: number;
  currency: string;
  formatted: string;
}

/**
 * Stripe API Service
 */
export const stripeService = {
  /**
   * GET /api/stripe/prices/:licenseType
   * Get price for a license type (cached)
   */
  async getPriceForLicense(licenseType: string): Promise<number | null> {
    try {
      const cacheKey = `stripe:price:${licenseType}`;
      const priceData = await apiCache.getOrFetch(
        cacheKey,
        () => api.get<PriceData>(`/stripe/prices/${encodeURIComponent(licenseType)}`),
        { ttl: 10 * 60 * 1000 } // 10 minutes cache
      );
      // Convert cents to euros
      return priceData.unit_amount / 100;
    } catch (error) {
      console.error("Error fetching price:", error);
      return null;
    }
  },

  /**
   * GET /api/stripe/club-fee
   * Get club fee
   */
  async getClubFee(): Promise<number> {
    try {
      const response = await api.get<ClubFeeResponse>("/stripe/club-fee");
      return response.amount / 100; // Convert cents to euros
    } catch (error) {
      console.error("Error fetching club fee:", error);
      return 20; // Default fallback
    }
  },

  /**
   * POST /api/stripe/calculate-total
   * Calculate total price including all components
   */
  async calculateTotal(
    licenseType: string,
    complements: { key: string; price: number }[] = [],
    printPhysicalCard: boolean = false,
    physicalCardPrice: number = 0
  ): Promise<PriceBreakdown | null> {
    try {
      return await api.post<PriceBreakdown>("/stripe/calculate-total", {
        licenseType,
        complements,
        printPhysicalCard,
        physicalCardPrice,
      });
    } catch (error) {
      console.error("Error calculating total:", error);
      return null;
    }
  },

  /**
   * POST /api/stripe/payment-intents
   * Create a payment intent
   */
  async createPaymentIntent(
    amount: number,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    // Amount should be in cents
    const amountInCents = Math.round(amount * 100);
    return api.post<PaymentIntent>("/stripe/payment-intents", {
      amount: amountInCents,
      currency: "eur",
      metadata,
    });
  },

  /**
   * POST /api/stripe/payment-intents/:id/confirm
   * Confirm a payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    return api.post<PaymentIntent>(
      `/stripe/payment-intents/${paymentIntentId}/confirm`
    );
  },

  /**
   * GET /api/stripe/payment-intents/:id
   * Get payment intent status
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    return api.get<PaymentIntent>(
      `/stripe/payment-intents/${paymentIntentId}`
    );
  },
};
