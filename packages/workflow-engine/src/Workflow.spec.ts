import { describe, expect, it } from "vitest";
import { WorkflowJson } from "./types";
import { Workflow } from "./Workflow";

describe("Workflow", () => {
  const workflowJson: WorkflowJson = {
    name: "Test Workflow",
    nodes: [
      {
        id: "1",
        name: "1",
        task: "sample-task",
      },
    ],
  };

  it("creates a workflow object", () => {
    const workflow = new Workflow(workflowJson);

    const firstNode = workflowJson.nodes[0];

    expect(workflow.getNode(firstNode.id)).toEqual(firstNode);
  });
});
