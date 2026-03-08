import { render } from "@react-email/components";

/**
 * Render a React Email component to an HTML string.
 * Thin wrapper to serve as the future integration point for sending.
 */
export async function renderEmail(
  component: React.ReactElement,
): Promise<string> {
  return render(component);
}
