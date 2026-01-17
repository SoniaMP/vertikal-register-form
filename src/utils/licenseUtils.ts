/**
 * Utility functions for license-related calculations and operations
 * Uses static licenseConfig for all federation data
 */

import { FederationType } from "../types/enums";
import { hasFixedComplementPrice, type LicenseConfig } from "../types";
import { licenseConfig } from "../config/licenseConfig";

// Club fee constant - in production this would come from config
const CLUB_FEE = 20;

/**
 * Check if the user is already federated
 */
export function isAlreadyFederated(licenseType: string): boolean {
  return licenseType === FederationType.ALREADY_FEDERATED;
}

/**
 * Get license config for a federation type
 */
export function getLicenseConfigForType(
  licenseType: string
): LicenseConfig | null {
  if (!licenseType || isAlreadyFederated(licenseType)) {
    return null;
  }
  return licenseConfig[licenseType as keyof typeof licenseConfig] || null;
}

/**
 * Get the physical card price for a federation type
 */
export function getPhysicalCardPrice(licenseType: string): number {
  const config = getLicenseConfigForType(licenseType);
  return config?.physicalCardPrice || 0;
}

/**
 * Calculate the total price for selected complements
 */
export function getComplementsTotal(
  licenseType: string,
  selectedComplements: Record<string, boolean>
): number {
  const config = getLicenseConfigForType(licenseType);
  if (!config) return 0;

  // If has fixed complement price, charge only if any complement is selected
  if (hasFixedComplementPrice(config)) {
    const hasAnyComplement = config.complements.some(
      (complement) => selectedComplements[complement.key]
    );
    return hasAnyComplement ? config.complementsFixedPrice! : 0;
  }

  // For other types, sum the price of each selected complement
  return config.complements.reduce((total, complement) => {
    if (selectedComplements[complement.key] && complement.price) {
      return total + complement.price;
    }
    return total;
  }, 0);
}

/**
 * Get the label for a selected license option
 */
export function getSelectedOptionLabel(
  licenseType: string,
  selectedOption: string
): string {
  if (!licenseType || !selectedOption) return "";
  const config = getLicenseConfigForType(licenseType);
  if (!config) return "";
  const option = config.options.find((opt) => opt.value === selectedOption);
  return option?.label || selectedOption;
}

/**
 * Get the club fee
 */
export function getClubFee(): number {
  return CLUB_FEE;
}

/**
 * Calculate the total price including all components
 */
export function calculateTotalPrice(
  licenseType: string,
  licensePrice: number | null,
  printPhysicalCard: boolean,
  selectedComplements: Record<string, boolean>
): number | null {
  const clubFee = getClubFee();

  // If already federated, only pay the club fee
  if (isAlreadyFederated(licenseType)) {
    return clubFee;
  }

  if (licensePrice === null) return null;

  const cardSupplement = printPhysicalCard
    ? getPhysicalCardPrice(licenseType)
    : 0;
  const complementsSupplement = getComplementsTotal(
    licenseType,
    selectedComplements
  );

  return licensePrice + clubFee + cardSupplement + complementsSupplement;
}

/**
 * Format complements for display in summary
 */
export function formatComplementsForDisplay(
  licenseType: string,
  selectedComplements: Record<string, boolean>
): string {
  const config = getLicenseConfigForType(licenseType);
  if (!config) return "";

  const selected = config.complements
    .filter((c) => selectedComplements[c.key])
    .map((c) => (c.price ? `${c.label} (+${c.price}€)` : c.label));

  if (selected.length === 0) return "";

  let result = selected.join(", ");
  if (hasFixedComplementPrice(config)) {
    result += ` (+${config.complementsFixedPrice}€)`;
  }

  return result;
}
