// Re-export all types from interfaces and enums
export type {
  FormData as RegistrationFormData,
  FederationConfig,
  GlobalConfig,
  LicenseOptionConfig,
  ComplementConfig,
} from "./interfaces";

export { FederationType, AppMode, Step, ViewState, Sex } from "./enums";
export type { FederationType as FederationTypeValue } from "./enums";

import type { FormData } from "./interfaces";

/**
 * License configuration for a federation
 */
export interface LicenseConfig {
  title: string;
  image: string;
  physicalCardPrice: number;
  options: { value: string; label: string }[];
  complements: { key: string; label: string; price?: number }[];
  complementsFixedPrice?: number;
}

/**
 * Map of federation type to license configuration
 */
export interface LicenseConfigMap {
  [key: string]: LicenseConfig;
}

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
 * Type for configs that may have fixed complement price
 */
interface ConfigWithComplements {
  complementsFixedPrice?: number;
}

/**
 * Type guard to check if config has fixed complement price
 */
export function hasFixedComplementPrice(
  config: ConfigWithComplements
): boolean {
  return config.complementsFixedPrice !== undefined;
}

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
