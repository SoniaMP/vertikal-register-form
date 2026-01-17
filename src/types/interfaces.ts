import type { FederationType } from "./enums";

/**
 * License option configuration from backend
 */
export interface LicenseOptionConfig {
  value: string;
  label: string;
}

/**
 * Complement configuration from backend
 */
export interface ComplementConfig {
  key: string;
  label: string;
  price?: number;
}

/**
 * Federation license configuration from backend
 */
export interface FederationConfig {
  id: FederationType;
  title: string;
  imageUrl: string;
  physicalCardPrice: number;
  options: LicenseOptionConfig[];
  complements: ComplementConfig[];
  complementsFixedPrice?: number;
}

/**
 * Global application configuration from backend
 */
export interface GlobalConfig {
  federations: FederationConfig[];
  clubFee: number;
  currency: string;
  clubInfo: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    email: string;
  };
}

export interface FederationConfig {
  id: FederationType;
  title: string;
  imageUrl: string;
  physicalCardPrice: number;
  options: LicenseOptionConfig[];
  complements: ComplementConfig[];
  complementsFixedPrice?: number;
}

/**
 * Form data for registration
 */
export interface FormData {
  fullName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  birthDate: string;
  dni: string;
  phone: string;
  sex: string;
  licenseType: string;
}
