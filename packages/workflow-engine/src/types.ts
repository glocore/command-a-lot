export type TaskMessage = Record<string, any>;

export type WorkflowVariable = string | number | boolean;

export type WorkflowNode = {
  id: string;
  name: string;
  type: string;
  next?: WorkflowNode["id"];
  props?: Record<string, any>;
};

export type WorkflowJson = {
  name: string;
  nodes: WorkflowNode[];
  variables?: Record<string, WorkflowVariable>;
};
