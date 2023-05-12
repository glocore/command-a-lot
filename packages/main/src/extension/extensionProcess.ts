import { BrowserWindow, app, utilityProcess } from "electron";
import * as path from "path";
import { MAIN_ROOT } from "../constants";
import getPort from "get-port";
import log from "electron-log";

export async function createExtensionProcess(
  filePath: string,
  options?: { args?: string[]; debug?: boolean }
) {
  let devToolsWindow: BrowserWindow | undefined;

  try {
    const child = utilityProcess.fork(
      path.join(MAIN_ROOT, "extensionHost.cjs"),
      [filePath, ...(options?.args ?? [])],
      {
        ...(options?.debug
          ? {
              stdio: "pipe",
              execArgv: [`--inspect=${await getPort()}`],
            }
          : {}),
      }
    );

    child.once("exit", () => {
      devToolsWindow?.close();
    });

    child.stderr?.once("data", async (data) => {
      log.info(data?.toString());
      const [debugUrl] = data.toString().match(/(?<=ws:\/\/).*/g) || [""];

      if (debugUrl) {
        const devToolsUrl = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${debugUrl}`;
        log.info(`DevTools URL: ${devToolsUrl}`);
        devToolsWindow = createDevToolsWindow(devToolsUrl);
      }
    });

    return child;
  } catch (error) {
    log.error("Error forking process", error);
  }
}

let inspectorCount = 0;

function createDevToolsWindow(devToolsUrl: string) {
  try {
    const win = new BrowserWindow();
    win.loadURL(devToolsUrl);

    inspectorCount++;

    win.on("close", () => {
      inspectorCount--;
      if (!inspectorCount) app.dock.hide();
    });

    app.dock.show();

    return win;
  } catch (error) {
    log.error(error);
  }
}
