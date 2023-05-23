import { describe, expect, it } from "vitest";
import { Context } from "./Context";

describe("Context", () => {
  it("creates a context object", () => {
    const variables = { number: 1 };
    const context = new Context({ variables });

    expect(context.variables).toEqual(variables);
  });
});
