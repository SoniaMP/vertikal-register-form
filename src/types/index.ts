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

// ── Membership status ──────────────────────────────

export const MEMBERSHIP_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type MembershipStatus =
  (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

// ── Member / Membership record types ───────────────

export type MemberRecord = {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MembershipSupplementRecord = {
  membershipId: string;
  supplementId: string;
  priceAtTime: number;
  supplement: Supplement;
};

export type MembershipRecord = {
  id: string;
  memberId: string;
  year: number;
  status: MembershipStatus;
  federationTypeId: string;
  federationSubtypeId: string;
  categoryId: string;
  isFederated: boolean;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  confirmationSent: boolean;
  consentedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  member: MemberRecord;
  federationType: FederationType;
  federationSubtype: FederationSubtype;
  category: Category;
  supplements: MembershipSupplementRecord[];
};
