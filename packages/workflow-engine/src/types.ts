export type TaskMessage = Record<string, any>;

export type WorkflowVariable = string | number | boolean;

export type BaseNode = {
  id: string;
  name: string;
  args?: Record<string, any>;
};

export type TaskNode = BaseNode & {
  task: string;
  next?: WorkflowNode["id"];
};

export type Variable = `$${string}`;

export type Input = "@input";

export type ComparisonOperator = ">" | "<" | "==" | "!=" | "<=" | ">=";

export type PresenceOperator = "@present" | "@absent";

export type Operand = Variable | Input | number | string;

/**
 * @examples
 * ```
 * [1, "<", 2]
 * ["$my_var", "<", 2]
 * ["@input", "<", 2]
 * ["@input", "@present"]
 * ["$my_var", "@absent"]
 * ```
 */
export type Expression =
  | [Operand, ComparisonOperator, Operand]
  | [Variable | Input, PresenceOperator];

export type ControlFlowNode = BaseNode & {
  switch: (
    | {
        case: Expression;
        goto: WorkflowNode["id"];
      }
    | {
        default: WorkflowNode["id"];
      }
  )[];
};

export type WorkflowNode = TaskNode | ControlFlowNode;

export type WorkflowJson = {
  name: string;
  nodes: WorkflowNode[];
  variables?: Record<string, WorkflowVariable>;
};
