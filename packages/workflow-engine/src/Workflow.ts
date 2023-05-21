import { WorkflowJson, WorkflowNode } from "./types";

export class Workflow {
  public workflowJson: WorkflowJson;
  public nodes: WorkflowNode[];

  constructor(workflowJson: WorkflowJson) {
    this.workflowJson = workflowJson;
    this.nodes = workflowJson.nodes;
  }

  getNode(id: WorkflowNode["id"]) {
    const node = this.nodes.find((n) => n.id === id);

    if (!node) throw Error(`Node with id "${id}" not found.`);

    return node;
  }

  get startNode() {
    return this.nodes[0];
  }
}
