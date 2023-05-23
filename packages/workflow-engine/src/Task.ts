import { Context } from "./Context";
import { TaskMessage, WorkflowNode } from "./types";

export abstract class Task {
  async run({
    node,
    message,
    context,
  }: {
    node: WorkflowNode;
    message: TaskMessage;
    context: Context;
  }): Promise<TaskMessage> {
    return {};
  }
}
