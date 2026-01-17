/**
 * Federados Service
 * Handles all federation-related API calls
 */

import { api, type ApiResponse } from "./api";
import type { Usuario, UsuarioInput, Federado } from "./usuariosService";

// Types
export interface FederadoInput {
  dni: string;
  anioVigente: number;
  numeroLicencia?: string | null;
  federation: "FERM" | "FMRM" | "FEDME";
  licenseType: string;
  selectedComplements: Record<string, boolean>;
  printPhysicalCard: boolean;
  generateLicense?: boolean;
}

export interface RegistroCompletoInput {
  usuario: UsuarioInput;
  federacion: {
    federation: "FERM" | "FMRM" | "FEDME";
    licenseType: string;
    selectedComplements: Record<string, boolean>;
    printPhysicalCard: boolean;
  };
}

export interface RegistroCompletoResult {
  usuario: Usuario;
  federado: Federado;
  isNewUser: boolean;
}

/**
 * Federados API Service
 */
export const federadosService = {
  /**
   * GET /api/federados/:dni/history
   * Get all federation records for a user
   */
  async getHistory(dni: string): Promise<Federado[]> {
    const response = await api.get<ApiResponse<Federado[]>>(
      `/federados/${encodeURIComponent(dni)}/history`
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error fetching federado history");
    }
    return response.data;
  },

  /**
   * GET /api/federados/:dni/:anio
   * Get federation record for a specific year
   */
  async getByYear(dni: string, anio: number): Promise<Federado> {
    const response = await api.get<ApiResponse<Federado>>(
      `/federados/${encodeURIComponent(dni)}/${anio}`
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Federado no encontrado");
    }
    return response.data;
  },

  /**
   * POST /api/federados
   * Create a new federation record
   */
  async create(data: FederadoInput): Promise<Federado> {
    const response = await api.post<ApiResponse<Federado>>("/federados", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error creating federado");
    }
    return response.data;
  },

  /**
   * PUT /api/federados/:dni/:anio
   * Update federation record
   */
  async update(
    dni: string,
    anio: number,
    data: Partial<FederadoInput>
  ): Promise<Federado> {
    const response = await api.put<ApiResponse<Federado>>(
      `/federados/${encodeURIComponent(dni)}/${anio}`,
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error updating federado");
    }
    return response.data;
  },

  /**
   * POST /api/registrar-completo
   * Complete registration: create/update user + create federation record
   */
  async registrarCompleto(
    data: RegistroCompletoInput
  ): Promise<RegistroCompletoResult> {
    const response = await api.post<ApiResponse<RegistroCompletoResult>>(
      "/registrar-completo",
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error en el registro");
    }
    return response.data;
  },

  /**
   * GET /api/anio-habil
   * Get current valid year for federation
   */
  async getAnioHabil(): Promise<number> {
    const response = await api.get<ApiResponse<{ anioHabil: number }>>(
      "/anio-habil"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error fetching año hábil");
    }
    return response.data.anioHabil;
  },
};

// Re-export types
export type { Federado } from "./usuariosService";
