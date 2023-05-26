import { EventEmitter } from "events";
import { Workflow } from "./Workflow";
import { Task } from "./Task";
import { WorkflowNode, TaskMessage, TaskNode, ControlFlowNode } from "./types";
import { Context } from "./Context";

const STATUS = {
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR",
} as const;

type Tasks = Map<string, Task>;

export class Runtime extends EventEmitter {
  private workflow: Workflow;
  private tasks: Tasks;
  private context: Context;
  private state: Record<WorkflowNode["id"], { status: keyof typeof STATUS }> =
    {};

  constructor({
    workflow,
    tasks,
    context,
  }: {
    workflow: Workflow;
    tasks: Tasks;
    context: Context;
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

    if (isTaskNode(node)) return this.runTaskNode(node, message);

    if (isControlFlowNode(node)) return this.runControlFlowNode(node, message);

    const error = Error(`Invalid node received: ${JSON.stringify(node)}`);
    this.emit("error", { error });
    throw error;
  }

  private async runTaskNode(node: TaskNode, message: TaskMessage) {
    const handleError = (error: unknown) => {
      this.state[node.id] = { status: STATUS.ERROR };
      this.emit("error", { error });
    };

    const task = this.tasks.get(node.task);

    if (!task) {
      const error = Error(`Could not find task ${node.task}`);
      handleError(error);
      throw error;
    }

    try {
      const taskMessage = { ...node.args, ...message };
      const result = await task.run({
        node,
        message: taskMessage,
        context: this.context,
      });

      this.state[node.id].status = STATUS.COMPLETED;

      if (node.next) {
        const nextNode = this.workflow.getNode(node.next);
        this.runNode({ node: nextNode, message: result });
      } else {
        this.emit("end", { message: result });
        return;
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  private async runControlFlowNode(
    node: ControlFlowNode,
    message: TaskMessage
  ) {
    /**
     * Expressions
     * 1 < 2
     * $my_var < 2
     * @input < 2
     * @input @present
     * $my_var @absent
     */
  }
}

function isTaskNode(node: WorkflowNode): node is TaskNode {
  return "task" in node;
}

function isControlFlowNode(node: WorkflowNode): node is ControlFlowNode {
  return "switch" in node;
}
