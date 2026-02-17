import { describe, it, expect } from "vitest";
import { parseParticipantParams } from "@/lib/course-participant-queries";

const COURSE_ID = "course-1";

describe("parseParticipantParams", () => {
  it("returns defaults when no params provided", () => {
    const result = parseParticipantParams({}, COURSE_ID);
    expect(result).toEqual({
      courseId: COURSE_ID,
      search: undefined,
      sortBy: "createdAt",
      sortDir: "desc",
      page: 1,
    });
  });

  it("parses valid sortBy field", () => {
    const result = parseParticipantParams({ sortBy: "lastName" }, COURSE_ID);
    expect(result.sortBy).toBe("lastName");
  });

  it("falls back to createdAt for invalid sortBy", () => {
    const result = parseParticipantParams({ sortBy: "invalid" }, COURSE_ID);
    expect(result.sortBy).toBe("createdAt");
  });

  it("parses valid sortDir", () => {
    const result = parseParticipantParams({ sortDir: "asc" }, COURSE_ID);
    expect(result.sortDir).toBe("asc");
  });

  it("falls back to desc for invalid sortDir", () => {
    const result = parseParticipantParams({ sortDir: "up" }, COURSE_ID);
    expect(result.sortDir).toBe("desc");
  });

  it("parses search string", () => {
    const result = parseParticipantParams({ search: "john" }, COURSE_ID);
    expect(result.search).toBe("john");
  });

  it("parses page number", () => {
    const result = parseParticipantParams({ page: "3" }, COURSE_ID);
    expect(result.page).toBe(3);
  });

  it("clamps page to minimum 1", () => {
    const result = parseParticipantParams({ page: "-5" }, COURSE_ID);
    expect(result.page).toBe(1);
  });

  it("defaults page to 1 for non-numeric values", () => {
    const result = parseParticipantParams({ page: "abc" }, COURSE_ID);
    expect(result.page).toBe(1);
  });

  it("ignores array values", () => {
    const result = parseParticipantParams(
      { sortBy: ["lastName", "email"] },
      COURSE_ID,
    );
    expect(result.sortBy).toBe("createdAt");
  });

  it("accepts all valid sort fields", () => {
    const fields = ["lastName", "email", "phone", "priceName", "createdAt"];
    for (const field of fields) {
      const result = parseParticipantParams({ sortBy: field }, COURSE_ID);
      expect(result.sortBy).toBe(field);
    }
  });
});
