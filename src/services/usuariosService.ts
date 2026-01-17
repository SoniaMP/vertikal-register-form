/**
 * Usuarios Service
 * Handles all user-related API calls
 */

import { api, type ApiResponse } from "./api";

// Types
export interface Usuario {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  birthDate: string;
  phone: string;
  sex: "Mujer" | "Hombre";
  createdAt: string;
  updatedAt: string;
}

export interface Federado {
  id: number;
  dni: string;
  anioVigente: number;
  numeroLicencia: string | null;
  federation: "FERM" | "FMRM" | "FEDME";
  licenseType: string;
  selectedComplements: Record<string, boolean>;
  printPhysicalCard: boolean;
}

export type UsuarioInput = Omit<Usuario, "id" | "createdAt" | "updatedAt">;

export interface RenewalData {
  usuario: Usuario;
  federado: Federado | null;
  anioHabil: number;
  canRenew: boolean;
  message?: string;
}

/**
 * Usuarios API Service
 */
export const usuariosService = {
  /**
   * GET /api/usuarios
   * Fetch all users
   */
  async getAll(): Promise<Usuario[]> {
    const response = await api.get<ApiResponse<Usuario[]>>("/usuarios");
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error fetching usuarios");
    }
    return response.data;
  },

  /**
   * GET /api/usuarios/:dni
   * Fetch user by DNI for renewal process
   */
  async getByDNI(dni: string): Promise<RenewalData> {
    const response = await api.get<ApiResponse<RenewalData>>(
      `/usuarios/${encodeURIComponent(dni)}`
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Usuario no encontrado");
    }
    return response.data;
  },

  /**
   * POST /api/usuarios
   * Create a new user
   */
  async create(data: UsuarioInput): Promise<Usuario> {
    const response = await api.post<ApiResponse<Usuario>>("/usuarios", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error creating usuario");
    }
    return response.data;
  },

  /**
   * PUT /api/usuarios/:dni
   * Update existing user
   */
  async update(dni: string, data: Partial<UsuarioInput>): Promise<Usuario> {
    const response = await api.put<ApiResponse<Usuario>>(
      `/usuarios/${encodeURIComponent(dni)}`,
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error updating usuario");
    }
    return response.data;
  },

  /**
   * DELETE /api/usuarios/:dni
   * Delete a user
   */
  async delete(dni: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(
      `/usuarios/${encodeURIComponent(dni)}`
    );
    if (!response.success) {
      throw new Error(response.error || "Error deleting usuario");
    }
  },
};
