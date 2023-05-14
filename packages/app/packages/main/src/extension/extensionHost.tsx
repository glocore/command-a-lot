import { createRemoteRoot, createRoot, RemoteRoot } from "@remote-ui/react";
import { createEndpoint, retain } from "@remote-ui/rpc";
import type { MessagePortMain } from "electron";
import { useState } from "react";
import { Button } from "remote-components";

declare global {
  var extPort: MessagePortMain | undefined;
}

process.parentPort.once("message", async (e) => {
  const [port] = e.ports;

  globalThis.extPort = port;

  port.start();

  const endpoint = createEndpoint({
    postMessage(message: any) {
      port.postMessage(message);
    },
    addEventListener(
      event: "message",
      listener: (event: MessageEvent) => void
    ) {
      // @ts-ignore
      port.addListener(event, listener);
    },
    removeEventListener(
      event: "message",
      listener: (event: MessageEvent) => void
    ) {
      // @ts-ignore
      port.removeListener(event, listener);
    },
    terminate() {
      port.close();
    },
  });

  let remoteRoot: RemoteRoot;

  function renderRemoteWidget(receiver: any) {
    retain(receiver);

    if (!remoteRoot) {
      remoteRoot = createRemoteRoot(receiver, {
        components: [Button],
      });
    }

    createRoot(remoteRoot).render(<RemoteWidget />);
    remoteRoot.mount();
  }

  endpoint.expose({ renderRemoteWidget });
});

function RemoteWidget() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Button onClick={() => setClickCount((c) => c + 1)}>
      {`Click count: ${clickCount}`}
    </Button>
  );
}
