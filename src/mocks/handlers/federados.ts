/**
 * MSW Handlers for Federados API
 */

import { http, HttpResponse, delay } from "msw";
import {
  db,
  getCurrentYear,
  type FederadoInput,
  type UsuarioInput,
} from "../data/db";

const API_BASE = "/api";

export const federadosHandlers = [
  // GET /api/federados/:dni - Get all federados for a user
  http.get(`${API_BASE}/federados/:dni/history`, async ({ params }) => {
    await delay(250);

    const { dni } = params as { dni: string };
    const federados = db.getAllFederadosByDNI(dni);

    return HttpResponse.json({
      success: true,
      data: federados,
    });
  }),

  // GET /api/federados/:dni/:anio - Get federado for specific year
  http.get(`${API_BASE}/federados/:dni/:anio`, async ({ params }) => {
    await delay(200);

    const { dni, anio } = params as { dni: string; anio: string };
    const federado = db.getFederadoByDNI(dni, parseInt(anio, 10));

    if (!federado) {
      return HttpResponse.json(
        {
          success: false,
          error: `No hay registro de federación para el año ${anio}.`,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: federado,
    });
  }),

  // POST /api/federados - Create new federado
  http.post(`${API_BASE}/federados`, async ({ request }) => {
    await delay(400);

    const data = (await request.json()) as FederadoInput & {
      generateLicense?: boolean;
    };

    // Check if already federated for this year
    const existing = db.existsFederadoForYear(data.dni, data.anioVigente);
    if (existing) {
      return HttpResponse.json(
        {
          success: false,
          error: `Ya existe una licencia para el año ${data.anioVigente}.`,
        },
        { status: 409 },
      );
    }

    // Generate license number if requested
    const numeroLicencia = data.generateLicense
      ? db.generateLicenseNumber(data.federation, data.anioVigente)
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

    const federado = db.createFederado(federadoData);
    return HttpResponse.json(
      {
        success: true,
        data: federado,
      },
      { status: 201 },
    );
  }),

  // PUT /api/federados/:dni/:anio - Update federado
  http.put(`${API_BASE}/federados/:dni/:anio`, async ({ params, request }) => {
    await delay(250);

    const { dni, anio } = params as { dni: string; anio: string };
    const data = (await request.json()) as Partial<FederadoInput>;

    const federado = db.updateFederado(dni, parseInt(anio, 10), data);
    if (!federado) {
      return HttpResponse.json(
        {
          success: false,
          error: "Federado no encontrado.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      data: federado,
    });
  }),

  // POST /api/registrar-completo - Complete registration (user + federado)
  http.post(`${API_BASE}/registrar-completo`, async ({ request }) => {
    await delay(500);

    const data = (await request.json()) as {
      usuario: UsuarioInput;
      federacion: {
        federation: "FERM" | "FMRM" | "FEDME";
        licenseType: string;
        selectedComplements: Record<string, boolean>;
        printPhysicalCard: boolean;
      };
    };

    const anioHabil = getCurrentYear();

    // Check if user exists
    let usuario = db.getUsuarioByDNI(data.usuario.dni);
    let isNewUser = false;

    if (usuario) {
      // Update existing user
      const updated = db.updateUsuario(data.usuario.dni, data.usuario);
      if (updated) usuario = updated;
    } else {
      // Create new user
      usuario = db.createUsuario(data.usuario);
      isNewUser = true;
    }

    // Check if already federated for this year
    const existingFederado = db.existsFederadoForYear(
      data.usuario.dni,
      anioHabil,
    );
    if (existingFederado) {
      return HttpResponse.json(
        {
          success: false,
          error: `Ya tienes una licencia registrada para el año ${anioHabil}.`,
        },
        { status: 409 },
      );
    }

    // Create federation record
    const numeroLicencia = db.generateLicenseNumber(
      data.federacion.federation,
      anioHabil,
    );
    const federado = db.createFederado({
      dni: data.usuario.dni,
      anioVigente: anioHabil,
      numeroLicencia,
      federation: data.federacion.federation,
      licenseType: data.federacion.licenseType,
      selectedComplements: data.federacion.selectedComplements,
      printPhysicalCard: data.federacion.printPhysicalCard,
    });

    return HttpResponse.json(
      {
        success: true,
        data: { usuario, federado, isNewUser },
      },
      { status: 201 },
    );
  }),

  // GET /api/anio-habil - Get current valid year
  http.get(`${API_BASE}/anio-habil`, async () => {
    await delay(100);

    return HttpResponse.json({
      success: true,
      data: { anioHabil: getCurrentYear() },
    });
  }),
];
