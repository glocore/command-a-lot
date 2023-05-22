import { describe, expect, it, vi } from "vitest";
import { Task } from "./Task";
import { TaskMessage, WorkflowJson, WorkflowNode } from "./types";
import { Workflow } from "./Workflow";
import { Runtime } from "./Runtime";

describe("Runtime", () => {
  it("runs a simple workflow", () => {
    const workflowJson: WorkflowJson = {
      name: "Yell text",
      nodes: [
        {
          id: "1",
          name: "1",
          task: "to-upper-case",
          props: {
            text: "hello world",
          },
          next: "2",
        },
        {
          id: "2",
          name: "2",
          task: "append-exclamation",
        },
      ],
    };

    const tasks = new Map<string, Task>();
    tasks.set("to-upper-case", new ToUpperCaseTask());
    tasks.set("append-exclamation", new AppendExclamationTask());

    const workflow = new Workflow(workflowJson);
    const context = { variables: {} };
    const runtime = new Runtime({ workflow, tasks, context });

    const onStart = vi.fn();
    const onEnd = (message: unknown) => {
      expect(message).toEqual({ message: { text: "HELLO WORLD!" } });
    };
    runtime.on("start", onStart);
    runtime.on("end", onEnd);

    runtime.start();
    expect(onStart).toBeCalledWith({ node: workflow.getNode("1") });
  });

  it("updates a variable", () => {
    const workflowJson: WorkflowJson = {
      name: "Add two",
      nodes: [
        {
          id: "1",
          name: "1",
          task: "add-two",
        },
      ],
    };

    const tasks = new Map<string, Task>();
    tasks.set("add-two", new AddTwoTask());

    const workflow = new Workflow(workflowJson);
    const context = { variables: { number: 1 } };
    const runtime = new Runtime({ workflow, tasks, context });

    runtime.on("end", () => {
      expect(context).toEqual({ variables: { number: 3 } });
    });

    runtime.start();
  });
});

class ToUpperCaseTask extends Task {
  async run({
    node,
    message,
  }: {
    node: WorkflowNode;
    message: TaskMessage;
  }): Promise<TaskMessage> {
    return {
      text: message.text.toUpperCase(),
    };
  }
}

class AppendExclamationTask extends Task {
  async run({
    node,
    message,
  }: {
    node: WorkflowNode;
    message: TaskMessage;
  }): Promise<TaskMessage> {
    return {
      text: `${message.text}!`,
    };
  }
}

class AddTwoTask extends Task {
  run: Task["run"] = async ({ node, message, context }) => {
    if (typeof context.variables.number === "number") {
      context.variables.number += 2;
    }
    
    return {};
  };
}
