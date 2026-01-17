/**
 * Utility functions to mask sensitive personal data for display purposes.
 * These functions help comply with data protection regulations (GDPR/LOPD)
 * by minimizing exposure of personal information in the UI.
 */

/**
 * Masks a Spanish DNI/NIE, showing only the last 4 characters.
 * Example: "12345678A" -> "•••••678A"
 */
export function maskDNI(dni: string): string {
  if (!dni || dni.length < 4) return dni;
  const visiblePart = dni.slice(-4);
  const maskedPart = "•".repeat(dni.length - 4);
  return maskedPart + visiblePart;
}

/**
 * Masks a phone number, showing only the last 3 digits.
 * Example: "612345678" -> "••• ••• 678"
 */
export function maskPhone(phone: string): string {
  if (!phone) return phone;
  // Remove spaces and non-digit characters for processing
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 3) return phone;
  const visiblePart = digits.slice(-3);
  return `••• ••• ${visiblePart}`;
}

/**
 * Masks an email address, showing first character and domain.
 * Example: "usuario@example.com" -> "u•••••••@example.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 1) return email;
  const firstChar = localPart[0];
  const maskedLocal = firstChar + "•".repeat(Math.min(localPart.length - 1, 7));
  return `${maskedLocal}@${domain}`;
}

/**
 * Masks an address, showing only the city/last part.
 * Example: "Calle Mayor 123, 28001 Madrid" -> "••••••••, Madrid"
 */
export function maskAddress(address: string): string {
  if (!address) return address;
  // Try to extract city (after last comma) or show partial
  const parts = address.split(",");
  if (parts.length > 1) {
    const city = parts[parts.length - 1].trim();
    return `••••••••, ${city}`;
  }
  // If no comma, mask most of it
  if (address.length <= 8) return address;
  return "••••••••" + address.slice(-8);
}
