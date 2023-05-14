import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from "@remote-ui/react/host";
import { useEffect, useMemo } from "react";
import { ButtonProps } from "remote-components";

const App = () => {
  const receiver = useMemo(() => createRemoteReceiver(), []);
  const controller = useMemo(() => createController({ Button }), []);

  useEffect(() => {
    setTimeout(() => {
      electronApi.createEndpointForReceiver(receiver);
    }, 1000);
  }, [receiver]);

  return (
    <div className="text-white">
      <input
        placeholder="Command-a-lot"
        className="w-full text-white placeholder:text-gray-500 bg-transparent border-b border-gray-700 px-4 py-3 text-lg outline-none"
      />
      <p>hello from react</p>
      <RemoteRenderer receiver={receiver} controller={controller} />
    </div>
  );
};
export default App;

const Button = (props: ButtonProps) => {
  return <button onClick={() => props.onClick?.()}>{props.children}</button>;
};
