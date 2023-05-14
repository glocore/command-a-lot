import path from "path";

/**
 * In development, this is `packages/main/src/`.
 * In production, this is `packages/main/dist/`.
 */
export const MAIN_ROOT = __dirname;

/** Workspace root */
export const APP_ROOT = path.join(MAIN_ROOT, "..", "..");

/** Monorepo root */
export const PROJECT_ROOT = path.join(APP_ROOT, "..", "..");
