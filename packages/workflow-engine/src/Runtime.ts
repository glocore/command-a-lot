import { EventEmitter } from "events";
import { Workflow } from "./Workflow";
import { Task } from "./Task";
import { WorkflowNode, TaskMessage, WorkflowContext } from "./types";

const STATUS = {
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR",
} as const;

type Tasks = Map<string, Task>;

export class Runtime extends EventEmitter {
  private workflow: Workflow;
  private tasks: Tasks;
  private context: WorkflowContext;
  private state: Record<WorkflowNode["id"], { status: keyof typeof STATUS }> =
    {};

  constructor({
    workflow,
    tasks,
    context,
  }: {
    workflow: Workflow;
    tasks: Tasks;
    context: WorkflowContext;
  }) {
    super();

    this.workflow = workflow;
    this.tasks = tasks;
    this.context = context;
  }

  start() {
    const startNode = this.workflow.startNode;

    this.runNode({ node: startNode });
    this.emit("start", { node: startNode });
  }

  private async runNode({
    node,
    message = {},
  }: {
    node: WorkflowNode;
    message?: TaskMessage;
  }) {
    this.state[node.id] = { status: STATUS.RUNNING };
    const task = this.tasks.get(node.type);

    const handleError = (error: unknown) => {
      this.state[node.id] = { status: STATUS.ERROR };
      this.emit("error", { error });
    };

    if (!task) {
      const error = Error(`Could not find task ${node.type}`);
      handleError(error);
      throw error;
    }

    try {
      const taskMessage = { ...node.props, ...message };
      const result = await task.run({
        node,
        message: taskMessage,
        context: this.context,
      });
      this.completeNode({ node, message: result });
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  private completeNode({
    node,
    message,
  }: {
    node: WorkflowNode;
    message: TaskMessage;
  }) {
    this.state[node.id].status = STATUS.COMPLETED;

    if (node.next) {
      const nextNode = this.workflow.getNode(node.next);
      this.runNode({ node: nextNode, message });
    } else {
      this.emit("end", { message });
      return;
    }
  }
}
