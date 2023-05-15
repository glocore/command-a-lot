import { ipcMain } from "electron";
import { mainWindow } from "../mainWindow";

const handlers = [
  function handleToggleDevTools() {
    ipcMain.on("OPEN_DEVTOOLS", () => {
      mainWindow?.webContents.openDevTools({ mode: "undocked" });
    });
  },
] as (() => void)[];

export function activateIpcHandlers() {
  handlers.forEach((f) => f());
}
