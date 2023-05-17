import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from "@remote-ui/react/host";
import { useEffect, useMemo } from "react";
import { ButtonProps } from "remote-components";
import { useWindowFocus } from "./hooks/useWindowFocus";

const App = () => {
  const receiver = useMemo(() => createRemoteReceiver(), []);
  const controller = useMemo(() => createController({ Button }), []);

  useEffect(() => {
    setTimeout(() => {
      electronApi.createEndpointForReceiver(receiver);
    }, 1000);
  }, [receiver]);

  return (
    <div className="text-white h-screen flex flex-col">
      <div className="flex-1">
        <input
          placeholder="Command-a-lot"
          className="w-full text-white placeholder:text-neutral-500 bg-transparent border-b border-neutral-500/50 px-4 py-3 text-lg outline-none"
        />
        <RemoteRenderer receiver={receiver} controller={controller} />
      </div>
      <Footer />
    </div>
  );
};
export default App;

const Button = (props: ButtonProps) => {
  return <button onClick={() => props.onClick?.()}>{props.children}</button>;
};

function Footer() {
  const isWindowFocused = useWindowFocus();

  return (
    <div className="bg-neutral-800/60 border-t border-neutral-500/50 flex justify-between px-2 py-1.5">
      <div />

      <div>
        <button
          className={`text-sm font-semibold rounded-md outline-none px-2 py-0.5 pr-0.5 ${
            isWindowFocused ? "text-neutral-400" : "text-neutral-500"
          } active:text-neutral-300 hover:bg-neutral-700 active:bg-neutral-600 transition-colors duration-75`}
        >
          <span className="pr-2">Actions</span>
          <kbd className="font-sans bg-neutral-700 rounded inline-block w-6 h-6 leading-6 mr-0.5">
            ⌘
          </kbd>
          <kbd className="font-sans bg-neutral-700 rounded inline-block w-6 h-6 leading-6">
            K
          </kbd>
        </button>
      </div>
    </div>
  );
}
