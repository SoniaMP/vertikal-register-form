/**
 * Configuration Service
 * Handles all configuration-related API calls using fetch
 * Includes caching to prevent duplicate requests
 */

import { api, type ApiResponse } from "./api";
import { apiCache } from "./cache";
import { FederationType } from "../types/enums";

// Types
export interface LicenseOptionConfig {
  value: string;
  label: string;
}

export interface ComplementConfig {
  key: string;
  label: string;
  price?: number;
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

export interface ClubInfo {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
}

export interface GlobalConfig {
  federations: FederationConfig[];
  clubFee: number;
  currency: string;
  clubInfo: ClubInfo;
}


/**
 * Configuration API Service
 */
export const configService = {
  /**
   * GET /api/config
   * Fetch global configuration from the backend (cached for 30 minutes)
   */
  async getGlobalConfig(): Promise<GlobalConfig> {
    return apiCache.getOrFetch(
      "config:global",
      async () => {
        const response = await api.get<ApiResponse<GlobalConfig>>("/config");
        if (!response.success || !response.data) {
          throw new Error(response.error || "Error fetching config");
        }
        return response.data;
      },
      { ttl: 30 * 60 * 1000 } // 30 minutes cache
    );
  },

  /**
   * GET /api/config/federations
   * Get all federations configuration
   */
  async getFederations(): Promise<FederationConfig[]> {
    const response = await api.get<ApiResponse<FederationConfig[]>>(
      "/config/federations"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error fetching federations");
    }
    return response.data;
  },

  /**
   * GET /api/config/federations/:id
   * Get federation configuration by ID
   */
  async getFederationConfig(
    federationId: FederationType
  ): Promise<FederationConfig | null> {
    try {
      const response = await api.get<ApiResponse<FederationConfig>>(
        `/config/federations/${federationId}`
      );
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/config/club
   * Get club info
   */
  async getClubInfo(): Promise<ClubInfo & { fee: number; currency: string }> {
    const response = await api.get<
      ApiResponse<ClubInfo & { fee: number; currency: string }>
    >("/config/club");
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error fetching club info");
    }
    return response.data;
  },
};
