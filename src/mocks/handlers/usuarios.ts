/**
 * MSW Handlers for Usuarios API
 */

import { http, HttpResponse, delay } from "msw";
import { db, getAnioHabil, type UsuarioInput } from "../data/db";

const API_BASE = "/api";

export const usuariosHandlers = [
  // GET /api/usuarios - Get all usuarios
  http.get(`${API_BASE}/usuarios`, async () => {
    await delay(150);

    const usuarios = db.getAllUsuarios();
    return HttpResponse.json({
      success: true,
      data: usuarios,
    });
  }),

  // GET /api/usuarios/:dni - Get usuario by DNI (for renewal)
  http.get(`${API_BASE}/usuarios/:dni`, async ({ params }) => {
    await delay(300);

    const { dni } = params as { dni: string };
    const result = db.getUsuarioConFederacion(dni);

    if (!result) {
      return HttpResponse.json(
        {
          success: false,
          error: "No se encontró ningún usuario con ese DNI en nuestro sistema.",
        },
        { status: 404 }
      );
    }

    const anioHabil = getAnioHabil();
    const alreadyRenewed = db.existsFederadoForYear(dni, anioHabil);

    return HttpResponse.json({
      success: true,
      data: {
        usuario: result.usuario,
        federado: result.federado,
        anioHabil,
        canRenew: !alreadyRenewed,
        message: alreadyRenewed
          ? `Ya tienes una licencia registrada para el año ${anioHabil}.`
          : undefined,
      },
    });
  }),

  // POST /api/usuarios - Create new usuario
  http.post(`${API_BASE}/usuarios`, async ({ request }) => {
    await delay(400);

    const data = (await request.json()) as UsuarioInput;

    // Check if DNI already exists
    const existing = db.getUsuarioByDNI(data.dni);
    if (existing) {
      return HttpResponse.json(
        {
          success: false,
          error: "Ya existe un usuario con ese DNI.",
        },
        { status: 409 }
      );
    }

    const usuario = db.createUsuario(data);
    return HttpResponse.json(
      {
        success: true,
        data: usuario,
      },
      { status: 201 }
    );
  }),

  // PUT /api/usuarios/:dni - Update usuario
  http.put(`${API_BASE}/usuarios/:dni`, async ({ params, request }) => {
    await delay(350);

    const { dni } = params as { dni: string };
    const data = (await request.json()) as Partial<UsuarioInput>;

    const usuario = db.updateUsuario(dni, data);
    if (!usuario) {
      return HttpResponse.json(
        {
          success: false,
          error: "Usuario no encontrado.",
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: usuario,
    });
  }),

  // DELETE /api/usuarios/:dni - Delete usuario
  http.delete(`${API_BASE}/usuarios/:dni`, async ({ params }) => {
    await delay(200);

    const { dni } = params as { dni: string };
    const deleted = db.deleteUsuario(dni);

    if (!deleted) {
      return HttpResponse.json(
        {
          success: false,
          error: "Usuario no encontrado.",
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "Usuario eliminado correctamente.",
    });
  }),
];
