export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type Supplement = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  federationTypeId: string;
};

export type FederationType = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  supplements: Supplement[];
};

export type PersonalData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
};

export type FederationSelection = {
  federationTypeId: string;
  supplementIds: string[];
};

export type RegistrationFormData = PersonalData & FederationSelection;

export type PriceBreakdown = {
  federationPrice: number;
  supplements: { name: string; price: number }[];
  total: number;
};

export type RegistrationRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  federationTypeId: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  confirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  federationType: FederationType;
  supplements: RegistrationSupplementRecord[];
};

export type RegistrationSupplementRecord = {
  supplementId: string;
  priceAtTime: number;
  supplement: Supplement;
};
