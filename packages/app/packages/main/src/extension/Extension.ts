export class Extension {
  readonly path: string;
  readonly manifest: Record<string, any>;

  constructor({
    path,
    manifest,
  }: {
    path: string;
    manifest: Record<string, any>;
  }) {
    this.path = path;
    this.manifest = manifest;
  }
}
