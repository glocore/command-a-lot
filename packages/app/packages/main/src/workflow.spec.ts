import { describe, expect, it, vi } from "vitest";
import { Workflow, runWorkflow } from "./workflow";

describe("runWorkflow", () => {
  it("runs a sequence of async tasks", async () => {
    const testFn = vi.fn();

    const asyncTask = () =>
      new Promise<void>((res) =>
        setTimeout(() => {
          testFn();
          res();
        }, 0)
      );

    const workflow: Workflow = [
      { task: asyncTask },
      { task: asyncTask },
      { task: asyncTask },
    ];

    await runWorkflow(workflow);

    expect(testFn).toBeCalledTimes(3);
  });

  it("fails the workflow if one of the tasks fails", async () => {
    const testFn = vi.fn();

    const asyncTask = () =>
      new Promise<void>((res) =>
        setTimeout(() => {
          testFn();
          res();
        }, 0)
      );

    const errorMessage = "Task failed successfully 💀";

    const asyncFailingTask = () =>
      new Promise<void>((_, rej) =>
        setTimeout(() => {
          rej(errorMessage);
        }, 0)
      );

    const workflow = [
      { task: asyncTask },
      { task: asyncFailingTask },
      { task: asyncTask },
    ];

    expect(runWorkflow(workflow)).rejects.toThrow(errorMessage);
  });
});
