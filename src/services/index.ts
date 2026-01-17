/**
 * Services Index
 * Central export for all API services
 */

// Core API client
export { api, API_BASE_URL, type ApiResponse, type ApiError } from "./api";

// Domain services
export { usuariosService } from "./usuariosService";
export type { Usuario, UsuarioInput, RenewalData, Federado } from "./usuariosService";

export { federadosService } from "./federadosService";
export type { FederadoInput, RegistroCompletoInput, RegistroCompletoResult } from "./federadosService";

export { stripeService } from "./stripeService";
export type { PriceData, PriceBreakdown, PaymentIntent } from "./stripeService";

export { configService } from "./configService";
export type { GlobalConfig, FederationConfig, ClubInfo } from "./configService";
