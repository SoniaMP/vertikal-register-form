import { describe, it, expect } from "vitest";
import { render } from "@react-email/components";
import CourseConfirmation from "../course-confirmation";

const defaultProps = {
  firstName: "Carlos",
  lastName: "López",
  email: "carlos@example.com",
  courseTitle: "Iniciación a la escalada deportiva",
  coursePriceName: "Socio",
  amountCents: 4500,
};

describe("CourseConfirmation", () => {
  it("renders the participant name", async () => {
    const html = await render(CourseConfirmation(defaultProps));
    expect(html).toContain("Carlos");
    expect(html).toContain("López");
  });

  it("renders course title and price name", async () => {
    const html = await render(CourseConfirmation(defaultProps));
    expect(html).toContain("Iniciación a la escalada deportiva");
    expect(html).toContain("Socio");
  });

  it("renders formatted price", async () => {
    const html = await render(CourseConfirmation(defaultProps));
    expect(html).toContain("45,00");
  });
});
