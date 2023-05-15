import { ipcRenderer } from "electron";

function handleDevtoolsHotkey() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "F12") {
      ipcRenderer.send("OPEN_DEVTOOLS");
    }
  });
}

export function enableHotkeys() {
  handleDevtoolsHotkey();
}
