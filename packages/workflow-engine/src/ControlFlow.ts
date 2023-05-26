import { Context } from "./Context";
import {
  ControlFlowNode,
  Expression,
  Input,
  Operand,
  TaskMessage,
  Variable,
  WorkflowNode,
} from "./types";

export class ControlFlow {
  private node: ControlFlowNode;
  private message: TaskMessage;
  private context: Context;

  constructor({
    node,
    message,
    context,
  }: {
    node: ControlFlowNode;
    message: TaskMessage;
    context: Context;
  }) {
    this.node = node;
    this.message = message;
    this.context = context;
  }

  decide(): WorkflowNode["id"] {
    for (const s of this.node.switch) {
      if ("case" in s) {
        const expression = s.case;
        const match = this.evaluate(expression);

        if (match) return s.goto;
      } else if ("default" in s) {
        return s.default;
      }
    }

    throw Error("Default case not defined");
  }

  evaluate(expression: Expression) {
    let [firstOperand, operator, secondOperand] = expression;
    firstOperand = this.getValue(firstOperand);
    secondOperand = this.getValue(secondOperand);

    switch (operator) {
      case "@present":
        return firstOperand !== undefined;

      case "@absent":
        return firstOperand === undefined;

      case "<":
        assertNumeric(firstOperand);
        assertNumeric(secondOperand);
        return firstOperand < secondOperand!;

      case ">":
        assertNumeric(firstOperand);
        assertNumeric(secondOperand);
        return firstOperand > secondOperand!;

      case "<=":
        assertNumeric(firstOperand);
        assertNumeric(secondOperand);
        return firstOperand <= secondOperand!;

      case ">=":
        assertNumeric(firstOperand);
        assertNumeric(secondOperand);
        return firstOperand >= secondOperand!;

      case "==":
        assertNumeric(firstOperand);
        assertNumeric(secondOperand);
        return firstOperand == secondOperand!;

      case "!=":
        assertNumeric(firstOperand);
        assertNumeric(secondOperand);
        return firstOperand != secondOperand!;

      default:
        const o: never = operator;
        throw Error(`Unrecognized operator received: ${o}`);
    }
  }

  getValue(operand?: Operand) {
    if (isVariable(operand)) return this.context.variables[operand];

    if (isInput(operand)) return this.message.payload;

    return operand;
  }
}

function isVariable(s: unknown): s is Variable {
  if (typeof s === "string") return s.startsWith("$");
  return false;
}

function isInput(s: unknown): s is Input {
  return s === "@input";
}

function assertNumeric(n: unknown): n is number | Date {
  if (n instanceof Date) return true;
  if (typeof n === "number") return true;

  throw Error(`Non-numeric value received: ${n}`);
}
