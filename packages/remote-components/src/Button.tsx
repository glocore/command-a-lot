import { createRemoteReactComponent } from "@remote-ui/react";

export interface ButtonProps {
  onClick?(): void;
  children?: string;
}

export const Button = createRemoteReactComponent<"Button", ButtonProps>(
  "Button"
);
