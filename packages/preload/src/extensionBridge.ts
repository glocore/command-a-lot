import { RemoteChannel, RemoteReceiver } from "@remote-ui/core";
import { createEndpoint } from "@remote-ui/rpc";
import { ipcRenderer } from "electron";

let port: MessagePort | undefined;

ipcRenderer.on("port", (e) => {
  [port] = e.ports;
});

export function createEndpointForReceiver(receiver: RemoteReceiver) {
  if (!port) {
    throw Error("Error creating endpoint: No MessagePort found.");
  }

  port.start();

  const endpoint = createEndpoint<{
    renderRemoteWidget: (channel: RemoteChannel) => void;
  }>(port);

  endpoint.call.renderRemoteWidget(receiver.receive);
}
