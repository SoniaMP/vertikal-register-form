/**
 * MSW Handlers Index
 * Exports all API handlers combined
 */

import { federadosHandlers } from "./federados";
import { stripeHandlers } from "./stripe";
import { configHandlers } from "./config";

export const handlers = [
  ...federadosHandlers,
  ...stripeHandlers,
  ...configHandlers,
];

// Re-export individual handler groups for testing
export { federadosHandlers, stripeHandlers, configHandlers };
