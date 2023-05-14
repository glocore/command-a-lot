import { describe, expect, it } from "vitest";
import { Extension } from "./Extension";

describe("Extension", () => {
  it("creates an extension object", () => {
    const config = { path: "/foo/bar/baz", manifest: {} };
    const extension = new Extension(config);
    expect(extension).toEqual(config);
  });
});
