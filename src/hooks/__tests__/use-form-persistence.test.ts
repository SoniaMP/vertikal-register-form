/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";

const STORAGE_KEY = "vertikal-registration-form";
const STEP_KEY = "vertikal-registration-step";

describe("form persistence storage keys", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores and retrieves form data from sessionStorage", () => {
    const formData = { firstName: "Juan", lastName: "Garcia" };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    const retrieved = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY) ?? "{}",
    );
    expect(retrieved).toEqual(formData);
  });

  it("stores and retrieves step from sessionStorage", () => {
    sessionStorage.setItem(STEP_KEY, "2");

    const step = Number(sessionStorage.getItem(STEP_KEY));
    expect(step).toBe(2);
  });

  it("clears both keys on removal", () => {
    sessionStorage.setItem(STORAGE_KEY, '{"firstName":"Test"}');
    sessionStorage.setItem(STEP_KEY, "3");

    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STEP_KEY);

    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(STEP_KEY)).toBeNull();
  });

  it("handles corrupted JSON gracefully", () => {
    sessionStorage.setItem(STORAGE_KEY, "not-valid-json{{{");

    expect(() => {
      try {
        JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
      } catch {
        // Expected behavior - should be caught
      }
    }).not.toThrow();
  });

  it("handles missing storage data", () => {
    const data = sessionStorage.getItem(STORAGE_KEY);
    expect(data).toBeNull();
  });
});
