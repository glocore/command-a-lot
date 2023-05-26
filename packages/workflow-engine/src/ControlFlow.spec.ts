import { describe, expect, it, test } from "vitest";
import {
  ComparisonOperator,
  ControlFlowNode,
  Input,
  Operand,
  PresenceOperator,
  Variable,
} from "./types";
import { ControlFlow } from "./ControlFlow";
import { Context } from "./Context";

describe("ControlFlow", () => {
  it.each([
    { first: 1, op: "!=", second: 2 },
    { first: 1, op: "==", second: 1 },
    { first: 1, op: "<", second: 2 },
    { first: 2, op: ">", second: 1 },
    { first: 1, op: "<=", second: 1 },
    { first: 1, op: ">=", second: 1 },
  ] as {
    first: Operand;
    op: ComparisonOperator;
    second: Operand;
  }[])(`evaluates the "$op" operator`, ({ first, op, second }) => {
    const node: ControlFlowNode = {
      id: "controlFlowNode",
      name: "controlFlowNode",
      switch: [
        { case: [first, op, second], goto: "correct-node" },
        { default: "wrong-node" },
      ],
    };

    const controlFlow = new ControlFlow({
      node,
      message: {},
      context: new Context(),
    });

    const nextNode = controlFlow.decide();

    expect(nextNode).toEqual("correct-node");
  });

  it.each([
    { first: "@input", op: "@present" },
    { first: "$my_var", op: "@absent" },
  ] as {
    first: Variable | Input;
    op: PresenceOperator;
  }[])(`evaluates the "$op" operator`, ({ first, op }) => {
    const node: ControlFlowNode = {
      id: "controlFlowNode",
      name: "controlFlowNode",
      switch: [
        { case: [first, op], goto: "correct-node" },
        { default: "wrong-node" },
      ],
    };

    const controlFlow = new ControlFlow({
      node,
      message: { payload: "wingus and dingus" },
      context: new Context(),
    });

    const nextNode = controlFlow.decide();

    expect(nextNode).toEqual("correct-node");
  });

  it("throws if a default case is not provided", () => {
    const node: ControlFlowNode = {
      id: "controlFlowNode",
      name: "controlFlowNode",
      switch: [{ case: [2, "<", 2], goto: "correct-node" }],
    };

    const controlFlow = new ControlFlow({
      node,
      message: {},
      context: new Context(),
    });

    expect(() => controlFlow.decide()).toThrowError("Default case not defined");
  });
});
