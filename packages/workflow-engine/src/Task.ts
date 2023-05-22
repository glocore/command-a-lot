import { TaskMessage, WorkflowContext, WorkflowNode } from "./types";

export abstract class Task {
  async run({
    node,
    message,
    context,
  }: {
    node: WorkflowNode;
    message: TaskMessage;
    context: WorkflowContext;
  }): Promise<TaskMessage> {
    return {};
  }
}
