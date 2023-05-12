import { describe, expect, it } from "vitest";
import { ExtensionRegistry } from "./ExtensionRegistry";
import { Extension } from "./Extension";

describe("ExtensionRegistry", () => {
  it("returns a list of registered extensions when getExtensions() is called", () => {
    const extensions = [
      new Extension({ path: "foo/bar", manifest: {} }),
      new Extension({ path: "lorem/ipsum", manifest: {} }),
    ];

    const extensionRegistry = new ExtensionRegistry(extensions);
    expect(extensionRegistry.getExtensions()).toEqual(extensions);
  });
});
