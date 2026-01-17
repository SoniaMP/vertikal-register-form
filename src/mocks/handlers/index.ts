/**
 * MSW Handlers Index
 * Exports all API handlers combined
 */

import { usuariosHandlers } from "./usuarios";
import { federadosHandlers } from "./federados";
import { stripeHandlers } from "./stripe";
import { configHandlers } from "./config";

export const handlers = [
  ...usuariosHandlers,
  ...federadosHandlers,
  ...stripeHandlers,
  ...configHandlers,
];

// Re-export individual handler groups for testing
export { usuariosHandlers, federadosHandlers, stripeHandlers, configHandlers };
