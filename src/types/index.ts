export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type SupplementGroup = {
  id: string;
  name: string;
  price: number;
  federationTypeId: string;
};

export type Supplement = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  active: boolean;
  federationTypeId: string;
  supplementGroupId: string | null;
  supplementGroup: SupplementGroup | null;
};

export type FederationSubtype = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  federationTypeId: string;
};

export type CategoryPrice = {
  id: string;
  categoryId: string;
  subtypeId: string;
  price: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  federationTypeId: string;
  prices: CategoryPrice[];
};

export type FederationType = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  subtypes: FederationSubtype[];
  supplements: Supplement[];
  categories: Category[];
  supplementGroups: SupplementGroup[];
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
  federationSubtypeId: string;
  categoryId: string;
  supplementIds: string[];
};

export type RegistrationFormData = PersonalData & FederationSelection;

export type SupplementBreakdownItem = {
  name: string;
  price: number;
  isGroup: boolean;
};

export type PriceBreakdown = {
  categoryName: string;
  categoryPrice: number;
  membershipFee: number;
  supplements: SupplementBreakdownItem[];
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
  federationSubtypeId: string;
  categoryId: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  confirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  federationType: FederationType;
  federationSubtype: FederationSubtype;
  category: Category;
  supplements: RegistrationSupplementRecord[];
};

export type RegistrationSupplementRecord = {
  supplementId: string;
  priceAtTime: number;
  supplement: Supplement;
};
