import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from "@remote-ui/react/host";
import { useEffect, useMemo, useState } from "react";
import { ButtonProps } from "#remote-components";

const App = () => {
  const receiver = useMemo(() => createRemoteReceiver(), []);
  const controller = useMemo(() => createController({ Button }), []);

  useEffect(() => {
    setTimeout(() => {
      electronApi.createEndpointForReceiver(receiver);
    }, 1000);
  }, [receiver]);

  return (
    <>
      <p>hello from react</p>
      <RemoteRenderer receiver={receiver} controller={controller} />
    </>
  );
};
export default App;

const Button = (props: ButtonProps) => {
  return <button onClick={() => props.onClick?.()}>{props.children}</button>;
};
