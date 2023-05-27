export type TaskMessage = Record<string, any>;

export type BaseNode = {
  id: string;
  name: string;
  args?: Record<string, any>;
};

export type TaskNode = BaseNode & {
  kind: "task";
  task: string;
  next?: WorkflowNode["id"];
};

export type VariableValue = string | number | boolean;

export type VariableName = `$${string}`;

export type Input = "@input";

export type ComparisonOperator = ">" | "<" | "==" | "!=" | "<=" | ">=";

export type PresenceOperator = "@present" | "@absent";

export type Operand = VariableName | Input | number | string;

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
  | [VariableName | Input, PresenceOperator];

export type ControlNode = BaseNode & {
  kind: "control";
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

export type WorkflowNode = TaskNode | ControlNode;

export type WorkflowJson = {
  version: number;
  name: string;
  nodes: WorkflowNode[];
  variables?: Record<VariableName, VariableValue>;
};
