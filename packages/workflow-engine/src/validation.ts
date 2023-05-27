import Ajv, { Schema, ValidateFunction } from "ajv";

const ajv = new Ajv({ allErrors: true, strictTuples: true });

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

export const operandSchema: Schema = {
  oneOf: [{ type: "number" }, { type: "string" }],
};

export const operatorSchema: Schema = {
  oneOf: [
    { const: ">" },
    { const: "<" },
    { const: "==" },
    { const: "!=" },
    { const: "<=" },
    { const: ">=" },
  ],
};

export const expressionSchema: Schema = {
  oneOf: [
    // Comparison operation
    {
      type: "array",
      minItems: 3,
      additionalItems: false,
      items: [operandSchema, operatorSchema, operandSchema],
    },

    // Presence operation
    {
      type: "array",
      minItems: 2,
      additionalItems: false,
      items: [
        {
          oneOf: [{ const: "@input" }, { type: "string", pattern: "^\\$.*$" }],
        },
        { oneOf: [{ const: "@absent" }, { const: "@present" }] },
      ],
    },
  ],
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
              case: expressionSchema,
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
