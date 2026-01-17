/**
 * Mock API Service
 * Simulates REST API endpoints for the frontend
 */

import {
  usuariosDB,
  federadosDB,
  generateLicenseNumber,
  getAnioHabil,
  type Usuario,
  type Federado,
  type UsuarioInput,
  type FederadoInput,
} from "./database";

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API Server
 */
export const apiMock = {
  /**
   * POST /api/usuarios
   * Create a new user
   */
  async createUsuario(data: UsuarioInput): Promise<ApiResponse<Usuario>> {
    await delay(400);

    try {
      // Check if DNI already exists
      const existing = await usuariosDB.getByDNI(data.dni);
      if (existing) {
        return {
          success: false,
          error: "Ya existe un usuario con ese DNI.",
        };
      }

      const usuario = await usuariosDB.create(data);
      return {
        success: true,
        data: usuario,
      };
    } catch {
      return {
        success: false,
        error: "Error al crear el usuario.",
      };
    }
  },

  /**
   * PUT /api/usuarios/:dni
   * Update existing user
   */
  async updateUsuario(
    dni: string,
    data: Partial<UsuarioInput>
  ): Promise<ApiResponse<Usuario>> {
    await delay(350);

    try {
      const usuario = await usuariosDB.update(dni, data);
      if (!usuario) {
        return {
          success: false,
          error: "Usuario no encontrado.",
        };
      }

      return {
        success: true,
        data: usuario,
      };
    } catch {
      return {
        success: false,
        error: "Error al actualizar el usuario.",
      };
    }
  },

  /**
   * POST /api/federados
   * Create a new federation record
   */
  async createFederado(
    data: Omit<FederadoInput, "numeroLicencia"> & { generateLicense?: boolean }
  ): Promise<ApiResponse<Federado>> {
    await delay(400);

    try {
      // Check if already federated for this year
      const existing = await federadosDB.existsForYear(data.dni, data.anioVigente);
      if (existing) {
        return {
          success: false,
          error: `Ya existe una licencia para el año ${data.anioVigente}.`,
        };
      }

      // Generate license number if requested
      const numeroLicencia = data.generateLicense
        ? generateLicenseNumber(data.federation, data.anioVigente)
        : null;

      const federadoData: FederadoInput = {
        dni: data.dni,
        anioVigente: data.anioVigente,
        numeroLicencia,
        federation: data.federation,
        licenseType: data.licenseType,
        selectedComplements: data.selectedComplements,
        printPhysicalCard: data.printPhysicalCard,
      };

      const federado = await federadosDB.create(federadoData);
      return {
        success: true,
        data: federado,
      };
    } catch {
      return {
        success: false,
        error: "Error al registrar la federación.",
      };
    }
  },

  /**
   * GET /api/federados/:dni/:anio
   * Check federation status for a specific year
   */
  async getFederadoByYear(
    dni: string,
    anio: number
  ): Promise<ApiResponse<Federado>> {
    await delay(200);

    try {
      const federado = await federadosDB.getByDNI(dni, anio);
      if (!federado) {
        return {
          success: false,
          error: `No hay registro de federación para el año ${anio}.`,
        };
      }

      return {
        success: true,
        data: federado,
      };
    } catch {
      return {
        success: false,
        error: "Error al consultar la federación.",
      };
    }
  },

  /**
   * GET /api/federados/:dni/history
   * Get all federation records for a user
   */
  async getFederadoHistory(dni: string): Promise<ApiResponse<Federado[]>> {
    await delay(250);

    try {
      const federados = await federadosDB.getAllByDNI(dni);
      return {
        success: true,
        data: federados,
      };
    } catch {
      return {
        success: false,
        error: "Error al consultar el historial de federaciones.",
      };
    }
  },

  /**
   * POST /api/registrar-completo
   * Complete registration: create/update user + create federation record
   */
  async registrarCompleto(data: {
    usuario: UsuarioInput;
    federacion: {
      federation: "FERM" | "FMRM" | "FEDME";
      licenseType: string;
      selectedComplements: Record<string, boolean>;
      printPhysicalCard: boolean;
    };
  }): Promise<
    ApiResponse<{ usuario: Usuario; federado: Federado; isNewUser: boolean }>
  > {
    await delay(500);

    try {
      const anioHabil = getAnioHabil();

      // Check if user exists
      let usuario = await usuariosDB.getByDNI(data.usuario.dni);
      let isNewUser = false;

      if (usuario) {
        // Update existing user
        const updated = await usuariosDB.update(data.usuario.dni, data.usuario);
        if (updated) usuario = updated;
      } else {
        // Create new user
        usuario = await usuariosDB.create(data.usuario);
        isNewUser = true;
      }

      // Check if already federated for this year
      const existingFederado = await federadosDB.existsForYear(
        data.usuario.dni,
        anioHabil
      );
      if (existingFederado) {
        return {
          success: false,
          error: `Ya tienes una licencia registrada para el año ${anioHabil}.`,
        };
      }

      // Create federation record
      const numeroLicencia = generateLicenseNumber(
        data.federacion.federation,
        anioHabil
      );
      const federado = await federadosDB.create({
        dni: data.usuario.dni,
        anioVigente: anioHabil,
        numeroLicencia,
        federation: data.federacion.federation,
        licenseType: data.federacion.licenseType,
        selectedComplements: data.federacion.selectedComplements,
        printPhysicalCard: data.federacion.printPhysicalCard,
      });

      return {
        success: true,
        data: { usuario, federado, isNewUser },
      };
    } catch {
      return {
        success: false,
        error: "Error al procesar el registro.",
      };
    }
  },

  /**
   * Get current valid year
   */
  getAnioHabil,
};

export type { ApiResponse };
