import { describe, expect, it } from "vitest";
import {
  controlNodeSchema,
  taskNodeSchema,
  validate,
  variablesSchema,
  workflowValidator,
} from "./validation";
import { ControlNode, TaskNode, WorkflowJson } from "./types";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

describe("taskNodeSchema", () => {
  const validator = ajv.compile(taskNodeSchema);

  it("validates a valid task node", () => {
    const taskNode: TaskNode = {
      kind: "task",
      id: "1",
      name: "1",
      task: "to-upper-case-task",
      args: {
        text: "hello world",
      },
      next: "2",
    };

    const { valid, errors } = validate(taskNode, validator);

    expect(errors).toBeFalsy();
    expect(valid).toBe(true);
  });

  it("flags an invalid task node", () => {
    const taskNode = {
      kind: "control",
      id: 1,
      name: 12,
      task: 12,
      args: {
        text: "hello world",
      },
      next: "2",
    };

    const { valid, errors } = validate(taskNode, validator);

    expect(errors).toBeTruthy();
    expect(valid).toBe(false);
  });
});

describe("controlNodeSchema", () => {
  const validator = ajv.compile(controlNodeSchema);

  it("validates a valid control node", () => {
    const controlNode: ControlNode = {
      kind: "control",
      id: "1",
      name: "1",
      switch: [{ case: ["@input", "@present"], goto: "2" }, { default: "2" }],
      args: {
        text: "hello world",
      },
    };

    const { valid, errors } = validate(controlNode, validator);

    expect(errors).toBeFalsy();
    expect(valid).toBe(true);
  });

  it("flags an invalid control node", () => {
    const controlNode = {
      kind: "control",
      id: "1",
      name: "1",
      task: 12,
    };

    const { valid, errors } = validate(controlNode, validator);

    expect(errors).toBeTruthy();
    expect(valid).toBe(false);
  });

  it.each([
    { case: ["invalid", "@present"] },
    { case: [2, "@absent"] },
    { case: [2, ">"] },
    { case: ["$my_var", ">"] },
  ])("flags an invalid switch expression: $case", (c) => {
    const controlNode = {
      kind: "control",
      id: "1",
      name: "1",
      switch: [{ case: c.case, goto: "2" }, { default: "2" }],
    };

    const { valid, errors } = validate(controlNode, validator);

    expect(errors).toBeTruthy();
    expect(valid).toBe(false);
  });
});

describe("variablesSchema", () => {
  const validator = ajv.compile(variablesSchema);

  it("validates a valid variables object", () => {
    const variables = {
      $my_var: 2,
      $my_other_var: 3,
    };

    const { valid, errors } = validate(variables, validator);

    expect(errors).toBeFalsy();
    expect(valid).toBe(true);
  });

  it("flags if a variable name doesn't start with $", () => {
    const variables = {
      $valid: 2,
      invalid: 3,
    };

    const { valid, errors } = validate(variables, validator);

    expect(errors).toBeTruthy();
    expect(valid).toBe(false);
  });
});

describe("workflowValidator", () => {
  it("validates a simple workflow", () => {
    const workflowJson: WorkflowJson = {
      version: 1.0,
      name: "Yell text",
      variables: {
        $asdf: "42",
      },
      nodes: [
        {
          kind: "task",
          id: "1",
          name: "1",
          task: "to-upper-case-task",
          args: {
            text: "hello world",
          },
          next: "2",
        },
        {
          kind: "task",
          id: "2",
          name: "2",
          task: "append-exclamation-task",
        },
        {
          kind: "control",
          id: "controlFlowNode",
          name: "controlFlowNode",
          switch: [
            { case: ["@input", ">", 2], goto: "correct-node" },
            { default: "wrong-node" },
          ],
        },
      ],
    };

    const { valid, errors } = validate(workflowJson, workflowValidator);

    expect(errors).toBeFalsy();
    expect(valid).toEqual(true);
  });
});
