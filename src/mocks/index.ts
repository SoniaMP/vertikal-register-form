/**
 * MSW Mock Server
 * Entry point for the mocking infrastructure
 */

export { worker } from "./browser";
export { handlers } from "./handlers";
export { db } from "./data/db";

/**
 * Initialize MSW for browser environment
 * Only starts in development mode
 */
export async function initMocks(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import("./browser");

    await worker.start({
      onUnhandledRequest: "bypass", // Don't warn about unhandled requests
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });

    console.log("[MSW] Mock server started");
  }
}
