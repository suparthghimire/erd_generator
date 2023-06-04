import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema, UiSchema } from "@rjsf/utils";

const schema: RJSFSchema = {
  title: "Test form",
  type: "string",
};
const uiSchema: UiSchema = {
  "ui:classNames": "text-black",
  "ui:title": "Test form",
};
const JSONEditor: React.FC = () => {
  return <Form schema={schema} uiSchema={uiSchema} validator={validator} />;
};

export default JSONEditor;
