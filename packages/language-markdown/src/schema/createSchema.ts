import { inline_styles } from "../inline_styles";

// tslint:disable-next-line
const { Schema } = require("prosemirror-model");

export function createSchema(isInlineStylesEnabled: boolean = false): any {
  const schema = require("prosemirror-markdown").schema;

  // TODO: don't register nodes and marks that are disabled in the options
  let marks = schema.spec.marks;
  if (isInlineStylesEnabled) {
    marks = marks.addToEnd("inline_styles", inline_styles);
  }

  return new Schema({
    nodes: schema.spec.nodes,
    marks
  });
}
