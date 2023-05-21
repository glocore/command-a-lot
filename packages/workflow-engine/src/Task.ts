import { TaskMessage, WorkflowNode } from "./types";

export abstract class Task {
  async run({
    node,
    message,
  }: {
    node: WorkflowNode;
    message: TaskMessage;
  }): Promise<TaskMessage> {
    return {};
  }
}
