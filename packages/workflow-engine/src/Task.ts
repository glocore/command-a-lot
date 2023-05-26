import { Context } from "./Context";
import { TaskMessage, TaskNode, WorkflowNode } from "./types";

export abstract class Task {
  async run({
    node,
    message,
    context,
  }: {
    node: TaskNode;
    message: TaskMessage;
    context: Context;
  }): Promise<TaskMessage> {
    return {};
  }
}
