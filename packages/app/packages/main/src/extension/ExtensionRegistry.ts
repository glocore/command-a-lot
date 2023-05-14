import { Extension } from "./Extension";

export class ExtensionRegistry {
  private extensions: Extension[];

  constructor(extensions: Extension[]) {
    this.extensions = extensions;
  }

  getExtensions() {
    return this.extensions;
  }
}
