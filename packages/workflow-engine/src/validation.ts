import Ajv, { Schema, ValidateFunction } from "ajv";

const ajv = new Ajv({ allErrors: true });

export const taskNodeSchema: Schema = {
  type: "object",
  required: ["id", "kind", "name", "task"],
  properties: {
    kind: { const: "task" },
    id: { type: "string" },
    name: { type: "string" },
    task: { type: "string" },
    args: { type: "object", nullable: true },
    next: { type: "string", nullable: true },
  },
};

export const controlNodeSchema: Schema = {
  type: "object",
  required: ["id", "kind", "name", "switch"],
  properties: {
    kind: { const: "control" },
    id: { type: "string" },
    name: { type: "string" },
    args: { type: "object", nullable: true },
    switch: {
      type: "array",
      items: {
        type: "object",
        required: [],
        oneOf: [
          {
            type: "object",
            required: ["case", "goto"],
            properties: {
              case: {
                type: "array",
                items: { type: ["string", "number"] },
              },
              goto: { type: "string" },
            },
          },
          {
            type: "object",
            required: ["default"],
            properties: {
              default: { type: "string" },
            },
          },
        ],
      },
    },
  },
};

export const variablesSchema: Schema = {
  type: "object",
  additionalProperties: false,
  required: [],
  nullable: true,
  patternProperties: {
    "^\\$.*$": {
      type: ["string", "number", "boolean"],
    },
  },
};

export const workflowSchema = {
  type: "object",
  required: ["name", "version", "nodes"],
  properties: {
    name: { type: "string" },
    version: { type: "number" },
    variables: variablesSchema,
    nodes: {
      type: "array",
      items: {
        type: "object",
        required: [],
        oneOf: [taskNodeSchema, controlNodeSchema],
      },
    },
  },
};

export const workflowValidator = ajv.compile(workflowSchema);

export const validate = (json: unknown, validator: ValidateFunction) => {
  const valid = validator(json);
  const errors = validator.errors;

  return { valid, errors };
};
