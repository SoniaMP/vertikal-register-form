/**
 * MSW Browser Worker Setup
 * Configures the service worker for browser mocking
 */

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Create the worker instance with all handlers
export const worker = setupWorker(...handlers);

// Export for use in tests or manual control
export { handlers };
