import { describe, it, expect } from "vitest";
import { escapeCsv, buildCsv, BOM } from "@/lib/csv-utils";

describe("escapeCsv", () => {
  it("returns plain values unchanged", () => {
    expect(escapeCsv("hello")).toBe("hello");
  });

  it("wraps values containing semicolons in quotes", () => {
    expect(escapeCsv("a;b")).toBe('"a;b"');
  });

  it("wraps values containing double quotes and escapes them", () => {
    expect(escapeCsv('say "hi"')).toBe('"say ""hi"""');
  });

  it("wraps values containing newlines in quotes", () => {
    expect(escapeCsv("line1\nline2")).toBe('"line1\nline2"');
  });

  it("handles empty strings", () => {
    expect(escapeCsv("")).toBe("");
  });

  it("handles combined special characters", () => {
    expect(escapeCsv('a;b"c\nd')).toBe('"a;b""c\nd"');
  });
});

describe("buildCsv", () => {
  it("produces BOM-prefixed semicolon-delimited CSV", () => {
    const header = ["Name", "Age"];
    const rows = [
      ["Alice", "30"],
      ["Bob", "25"],
    ];
    const result = buildCsv(header, rows);
    expect(result).toBe(`${BOM}Name;Age\nAlice;30\nBob;25`);
  });

  it("escapes values in the output", () => {
    const result = buildCsv(["Col"], [['val;with"special']]);
    expect(result).toBe(`${BOM}Col\n"val;with""special"`);
  });

  it("handles empty rows", () => {
    const result = buildCsv(["A", "B"], []);
    expect(result).toBe(`${BOM}A;B`);
  });
});
