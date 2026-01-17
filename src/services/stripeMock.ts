// Mock Stripe Server - Simulates Stripe API responses

interface PriceData {
  id: string
  currency: string
  unit_amount: number
  product: string
}

interface PaymentIntentData {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

// Precio genérico para todas las licencias: 60€
const DEFAULT_LICENSE_PRICE = 6000 // 60€ in cents

// Cuota del club
const CLUB_FEE = 2000 // 20€ in cents

// Genera precio para cualquier tipo de licencia
const generatePriceData = (licenseType: string): PriceData => ({
  id: `price_${licenseType.toLowerCase().replace(/\s+/g, '_')}_mock`,
  currency: 'eur',
  unit_amount: DEFAULT_LICENSE_PRICE,
  product: `prod_${licenseType.toLowerCase().replace(/\s+/g, '_')}_mock`
})

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const stripeMockServer = {
  // Get price for a license type (60€ for all licenses)
  async getPrice(licenseType: string): Promise<PriceData | null> {
    await delay(300) // Simulate network delay
    if (!licenseType) return null
    return generatePriceData(licenseType)
  },

  // Get club fee
  getClubFee(): number {
    return CLUB_FEE / 100 // Return in euros
  },

  // Create a payment intent
  async createPaymentIntent(amount: number, currency: string = 'eur'): Promise<PaymentIntentData> {
    await delay(500) // Simulate network delay

    return {
      id: `pi_mock_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_mock_${Date.now()}_secret_mock`
    }
  },

  // Calculate total including club fee and complements
  async calculateTotal(
    _licenseType: string,
    complements: { key: string; price: number }[] = [],
    printPhysicalCard: boolean = false,
    physicalCardPrice: number = 0
  ): Promise<{
    licensePrice: number;
    clubFee: number;
    complementsTotal: number;
    physicalCardPrice: number;
    total: number;
  }> {
    await delay(200)

    const licensePrice = DEFAULT_LICENSE_PRICE / 100
    const clubFee = CLUB_FEE / 100
    const complementsTotal = complements.reduce((sum, c) => sum + c.price, 0)
    const cardPrice = printPhysicalCard ? physicalCardPrice : 0

    return {
      licensePrice,
      clubFee,
      complementsTotal,
      physicalCardPrice: cardPrice,
      total: licensePrice + clubFee + complementsTotal + cardPrice
    }
  }
}
