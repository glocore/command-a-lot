export type TaskMessage = Record<string, any>;

export type WorkflowContext = {
  variables: Record<string, string | number | boolean>;
};

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
