/**
 * Sandboxing is enabled.
 * Node APIs are not available.
 * Also, libraries that use Node APIs cannot be used.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 * https://github.com/cawa-93/vite-electron-builder/issues/880
 */
import { createEndpointForReceiver } from "./extensionBridge";
import { enableHotkeys } from "./hotkeys";
const electronApi = {
  createEndpointForReceiver,
} as const;

export type ElectronApi = typeof electronApi;

// @ts-ignore
window.electronApi = electronApi;

enableHotkeys();