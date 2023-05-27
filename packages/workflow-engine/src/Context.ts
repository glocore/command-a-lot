import { VariableValue } from "./types";

export class Context {
  public variables: Record<string, VariableValue>;

  constructor(
    { variables = {} }: { variables?: Record<string, VariableValue> } = {
      variables: {},
    }
  ) {
    this.variables = structuredClone(variables);
  }
}
