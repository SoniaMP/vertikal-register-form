// Re-export all types from interfaces and enums
export type {
  FormData as RegistrationFormData,
  FederationConfig,
  GlobalConfig,
  LicenseOptionConfig,
  ComplementConfig,
} from "./interfaces";

export { FederationType, Step, ViewState, Sex } from "./enums";
export type { FederationType as FederationTypeValue } from "./enums";

import type { FormData } from "./interfaces";

/**
 * Initial empty form data
 */
export const INITIAL_FORM_DATA: FormData = {
  fullName: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  birthDate: "",
  dni: "",
  phone: "",
  sex: "",
  licenseType: "",
};

/**
 * Checkout data passed to the payment component
 */
export interface CheckoutData {
  selectedOption: string;
  printPhysicalCard: boolean;
  physicalCardPrice: number;
  selectedComplements: Record<string, boolean>;
  complementsTotal: number;
  licensePrice: number;
  clubFee: number;
  totalPrice: number;
  formData: FormData;
}

/**
 * Order data for success page
 */
export interface OrderData {
  selectedOption: string;
  totalPrice: number;
  formData: FormData;
}
