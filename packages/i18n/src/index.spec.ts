import { describe, expect, it } from "vitest";
import { createTranslator } from ".";

describe("createTranslator", () => {
  it("returns pt-BR copy", () => {
    expect(createTranslator()("app.name")).toBe("MigOculto");
  });
});
