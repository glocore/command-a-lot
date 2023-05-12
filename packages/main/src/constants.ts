import path from "path";

/**
 * In development, this is `packages/main/src/`.
 * In production, this is `packages/main/dist/`.
 */
export const MAIN_ROOT = __dirname;

export const PROJECT_ROOT = path.join(__dirname, "..", "..", "..");
