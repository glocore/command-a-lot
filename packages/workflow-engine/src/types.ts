export type TaskMessage = Record<string, any>;

export type WorkflowNode = {
  id: string;
  name: string;
  task: string;
  next?: WorkflowNode["id"];
  props?: Record<string, any>;
};

export type WorkflowJson = {
  name: string;
  nodes: WorkflowNode[];
};
