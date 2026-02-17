/** UTF-8 BOM so Excel opens CSV files with correct encoding. */
export const BOM = "\uFEFF";

/** Escape a value for semicolon-delimited CSV. */
export function escapeCsv(value: string): string {
  if (value.includes(";") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Join header + rows into a BOM-prefixed, semicolon-delimited CSV string. */
export function buildCsv(header: string[], rows: string[][]): string {
  return (
    BOM +
    [header, ...rows].map((row) => row.map(escapeCsv).join(";")).join("\n")
  );
}
