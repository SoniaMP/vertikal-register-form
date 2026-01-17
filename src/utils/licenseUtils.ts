/**
 * Utility functions for license-related calculations and operations
 * All functions receive federation config as a parameter
 */

import { FederationType } from "../types/enums";
import type { FederationConfig } from "../services/configService";

/**
 * Check if the user is already federated
 */
export function isAlreadyFederated(licenseType: string): boolean {
  return licenseType === FederationType.ALREADY_FEDERATED;
}

/**
 * Get the physical card price from config
 */
export function getPhysicalCardPrice(config: FederationConfig | null): number {
  return config?.physicalCardPrice || 0;
}

/**
 * Calculate the total price for selected complements
 */
export function getComplementsTotal(
  config: FederationConfig | null,
  selectedComplements: Record<string, boolean>
): number {
  if (!config) return 0;

  // If has fixed complement price, charge only if any complement is selected
  if (config.complementsFixedPrice !== undefined) {
    const hasAnyComplement = config.complements.some(
      (complement) => selectedComplements[complement.key]
    );
    return hasAnyComplement ? config.complementsFixedPrice : 0;
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
  config: FederationConfig | null,
  selectedOption: string
): string {
  if (!config || !selectedOption) return "";
  const option = config.options.find((opt) => opt.value === selectedOption);
  return option?.label || selectedOption;
}

/**
 * Calculate the total price including all components
 */
export function calculateTotalPrice(
  licenseType: string,
  config: FederationConfig | null,
  licensePrice: number | null,
  printPhysicalCard: boolean,
  selectedComplements: Record<string, boolean>,
  clubFee: number
): number | null {
  // If already federated, only pay the club fee
  if (isAlreadyFederated(licenseType)) {
    return clubFee;
  }

  if (licensePrice === null) return null;

  const cardSupplement = printPhysicalCard ? getPhysicalCardPrice(config) : 0;
  const complementsSupplement = getComplementsTotal(config, selectedComplements);

  return licensePrice + clubFee + cardSupplement + complementsSupplement;
}

/**
 * Format complements for display in summary
 */
export function formatComplementsForDisplay(
  config: FederationConfig | null,
  selectedComplements: Record<string, boolean>
): string {
  if (!config) return "";

  const selected = config.complements
    .filter((c) => selectedComplements[c.key])
    .map((c) => (c.price ? `${c.label} (+${c.price}€)` : c.label));

  if (selected.length === 0) return "";

  let result = selected.join(", ");
  if (config.complementsFixedPrice !== undefined) {
    result += ` (+${config.complementsFixedPrice}€)`;
  }

  return result;
}
