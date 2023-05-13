import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from "@remote-ui/react/host";
import { useEffect, useMemo, useState } from "react";

const App = () => {
  const receiver = useMemo(() => createRemoteReceiver(), []);
  const controller = useMemo(() => createController({ Button }), []);

  const [, forceRender] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log("effect is running");
      electronApi.createEndpointForReceiver(receiver);
      forceRender((v) => v + 1);
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

const Button = (props: { onClick: () => void; children: string }) => {
  return <button onClick={() => props.onClick()}>{props.children}</button>;
};
