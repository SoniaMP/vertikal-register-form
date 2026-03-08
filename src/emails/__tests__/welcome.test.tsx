import { describe, it, expect } from "vitest";
import { render } from "@react-email/components";
import Welcome from "../welcome";

const defaultProps = {
  firstName: "Ana",
  lastName: "Martínez",
};

describe("Welcome", () => {
  it("renders the member name", async () => {
    const html = await render(Welcome(defaultProps));
    expect(html).toContain("Ana");
    expect(html).toContain("Martínez");
  });

  it("renders welcome message", async () => {
    const html = await render(Welcome(defaultProps));
    expect(html).toContain("Bienvenido/a a Club Vertikal");
  });

  it("renders club footer", async () => {
    const html = await render(Welcome(defaultProps));
    expect(html).toContain("Club Vertikal");
    expect(html).toContain("Escalada y Montaña");
  });
});
