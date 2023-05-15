import { app, BrowserWindow, MessageChannelMain } from "electron";
import { join, resolve } from "node:path";
import { createExtensionProcess } from "./extension/extensionProcess";
import { activateIpcHandlers } from "./ipc/handlers";

export let mainWindow: BrowserWindow | undefined;

async function createMainWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    vibrancy: "hud",
    frame: false,
    webPreferences: {
      /**
       * TLDR: We need to disable context isolation to make `remote-ui` work.
       *
       * Explanation: `remote-ui` communicates with the remote environment via a
       * MessagePort, which is only accessible in the preload script's realm.
       * remote-ui's host environment in the renderer needs to pass messages via
       * this MessagePort. When context isolation is enabled, objects are cloned
       * while crossing the context bridge and lose their references in the
       * process. We're currently not executed untrusted/remote code in the
       * renderer, and so this is an okay tradeoff until we figure out a way to
       * make this work.
       */
      contextIsolation: false,
      preload: join(app.getAppPath(), "packages/preload/dist/index.cjs"),
    },
  });

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on("ready-to-show", () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools({ mode: "undocked" });
    }
  });

  /**
   * Load the main page of the main window.
   */
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
  ) {
    /**
     * Load from the Vite dev server for development.
     */
    await browserWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    /**
     * Load from the local file system for production and test.
     *
     * Use BrowserWindow.loadFile() instead of BrowserWindow.loadURL() for WhatWG URL API limitations
     * when path contains special characters like `#`.
     * Let electron handle the path quirks.
     * @see https://github.com/nodejs/node/issues/12682
     * @see https://github.com/electron/electron/issues/6869
     */
    await browserWindow.loadFile(
      resolve(__dirname, "../../ui/dist/index.html")
    );
  }

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  if (mainWindow === undefined) {
    activateIpcHandlers();
    mainWindow = await createMainWindow();
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.focus();

  const { port1, port2 } = new MessageChannelMain();
  const extensionProcess = await createExtensionProcess("foo/bar/baz");
  extensionProcess?.postMessage("port", [port2]);
  mainWindow.webContents.postMessage("port", undefined, [port1]);
}
