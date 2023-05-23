import { WorkflowVariable } from "./types";

export class Context {
  public variables: Record<string, WorkflowVariable>;

  constructor(
    { variables = {} }: { variables?: Record<string, WorkflowVariable> } = {
      variables: {},
    }
  ) {
    this.variables = structuredClone(variables);
  }
}
