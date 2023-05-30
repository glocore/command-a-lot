import { describe, expect, it, vi } from "vitest";
import { Context } from "./Context";
import { Runtime } from "./Runtime";
import { Task } from "./Task";
import { Workflow } from "./Workflow";
import { WorkflowJson } from "./types";

describe("Runtime", () => {
  it("runs a simple workflow", () =>
    new Promise<void>((res, rej) => {
      const workflowJson: WorkflowJson = {
        version: 1.0,
        name: "Yell text",
        nodes: [
          {
            kind: "task",
            id: "1",
            name: "1",
            task: "to-upper-case-task",
            args: {
              text: "hello world",
            },
            next: "2",
          },
          {
            kind: "task",
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
        try {
          expect(message).toEqual({ message: { text: "HELLO WORLD!" } });
          res();
        } catch (error) {
          rej(error);
        }
      };
      runtime.on("start", onStart);
      runtime.on("end", onEnd);

      runtime.start();
      expect(onStart).toBeCalledWith({ node: workflow.getNode("1") });
    }));

  it("updates a variable", () =>
    new Promise<void>((res, rej) => {
      const workflowJson: WorkflowJson = {
        version: 1.0,
        name: "Add two",
        variables: { $number: 1 },
        nodes: [
          {
            kind: "task",
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
        try {
          expect(context).toEqual({ variables: { $number: 3 } });
          res();
        } catch (error) {
          rej(error);
        }
      });

      runtime.start();
    }));
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
    if (typeof context.variables.$number === "number") {
      context.variables.$number += 2;
    }

    return {};
  };
}
