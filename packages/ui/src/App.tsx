import {
  RemoteRenderer,
  createController,
  createRemoteReceiver,
} from "@remote-ui/react/host";
import { useEffect, useMemo, useState } from "react";
import { ButtonProps } from "remote-components";
import { useWindowFocus } from "./hooks/useWindowFocus";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import tinykeys from "tinykeys";
import { cn } from "./utils";

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
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      "$mod+K": () => setIsActionsOpen((o) => !o),
    });
    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="bg-neutral-800/60 border-t border-neutral-500/50 flex justify-between px-2 py-1.5 enable-window-drag">
      <div />

      <div>
        <DropdownMenu.Root
          onOpenChange={(open) => setIsActionsOpen(open)}
          open={isActionsOpen}
        >
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                "text-sm font-semibold rounded-md outline-none px-2 py-0.5 pr-0.5 hover:bg-neutral-700 transition-colors duration-75",
                {
                  "text-neutral-400": isWindowFocused,
                  "text-neutral-500": !isWindowFocused,
                  "text-neutral-300": isActionsOpen,
                  "bg-neutral-600": isActionsOpen,
                }
              )}
            >
              <span className="pr-2 select-none transition-colors duration-75">
                Actions
              </span>
              <kbd
                className={cn(
                  "font-sans bg-neutral-700 rounded inline-block w-6 h-6 leading-6 mr-0.5 select-none transition-colors duration-75",
                  {
                    "bg-neutral-600": isActionsOpen,
                    "text-neutral-300": isActionsOpen,
                  }
                )}
              >
                ⌘
              </kbd>
              <kbd
                className={cn(
                  "font-sans bg-neutral-700 rounded inline-block w-6 h-6 leading-6 select-none transition-colors duration-75",
                  {
                    "bg-neutral-600": isActionsOpen,
                    "text-neutral-300": isActionsOpen,
                  }
                )}
              >
                K
              </kbd>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="h-40 w-80 -top-4 right-2 relative rounded-lg bg-neutral-800/50 border border-neutral-500/50 shadow-lg shadow-neutral-900"></DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
