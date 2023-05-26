import { describe, expect, it, vi } from "vitest";
import { Task } from "./Task";
import { TaskMessage, WorkflowJson, WorkflowNode } from "./types";
import { Workflow } from "./Workflow";
import { Runtime } from "./Runtime";
import { Context } from "./Context";

describe("Runtime", () => {
  it("runs a simple workflow", () => {
    const workflowJson: WorkflowJson = {
      name: "Yell text",
      nodes: [
        {
          id: "1",
          name: "1",
          task: "to-upper-case-task",
          args: {
            text: "hello world",
          },
          next: "2",
        },
        {
          id: "2",
          name: "2",
          task: "append-exclamation-task",
        },
      ],
    };

    const tasks = new Map<string, Task>();
    tasks.set("to-upper-case-task", new ToUpperCaseTask());
    tasks.set("append-exclamation-task", new AppendExclamationTask());

    const workflow = new Workflow(workflowJson);
    const context = new Context();
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
      variables: { number: 1 },
      nodes: [
        {
          id: "1",
          name: "1",
          task: "add-two-task",
        },
      ],
    };

    const tasks = new Map<string, Task>();
    tasks.set("add-two-task", new AddTwoTask());

    const workflow = new Workflow(workflowJson);
    const context = new Context({ variables: workflowJson.variables });
    const runtime = new Runtime({ workflow, tasks, context });

    runtime.on("end", () => {
      expect(context).toEqual({ variables: { number: 3 } });
    });

    runtime.start();
  });
});

class ToUpperCaseTask extends Task {
  run: Task["run"] = async ({ node, message, context }) => {
    return {
      text: message.text.toUpperCase(),
    };
  };
}

class AppendExclamationTask extends Task {
  run: Task["run"] = async ({ node, message, context }) => {
    return {
      text: `${message.text}!`,
    };
  };
}

class AddTwoTask extends Task {
  run: Task["run"] = async ({ node, message, context }) => {
    if (typeof context.variables.number === "number") {
      context.variables.number += 2;
    }
    
    return {};
  };
}
