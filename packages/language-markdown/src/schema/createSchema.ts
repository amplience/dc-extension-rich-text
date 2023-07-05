import { StandardToolOptions } from "@dc-extension-rich-text/common";
import { heading_align, paragraph_align } from "../alignment/AlignmentPlugin";
import { anchor } from "../anchor";
import { inline_styles } from "../inline_styles";
import { createMarkdownParser } from "../markdown/MarkdownParser";
import { createMarkdownSerializer } from "../markdown/MarkdownSerializer";
import { soft_hyphen } from "../soft_hyphen";

// tslint:disable-next-line
const { tableNodes } = require("prosemirror-tables");

// tslint:disable-next-line
const { Schema } = require("prosemirror-model");

export function createSchema(
  options: StandardToolOptions,
  isInlineStylesEnabled: boolean = false
): any {
  const schema = require("prosemirror-markdown").schema;

  // TODO: don't register nodes and marks that are disabled in the options
  let marks = schema.spec.marks;
  if (isInlineStylesEnabled) {
    marks = marks.addToEnd("inline_styles", inline_styles);
  }

  const nodes = schema.spec.nodes
    .append(
      tableNodes({
        tableGroup: "block",
        cellContent: "block",
        cellAttributes: {
          background: {
            default: null,
            // tslint:disable-next-line
            getFromDOM(dom: any) {
              return dom.style.backgroundColor || null;
            },
            // tslint:disable-next-line
            setDOMAttr(value: any, attrs: any) {
              if (value) {
                attrs.style =
                  (attrs.style || "") + `background-color: ${value};`;
              }
            }
          }
        }
      })
    )
    .addToEnd("soft_hyphen", soft_hyphen)
    .addToEnd("anchor", anchor)
    .update("paragraph", paragraph_align)
    .update("heading", heading_align);

  return new Schema({
    nodes,
    marks
  });
}

let serializer: any;
let parser: any;

export function getDefaultSerializerParser(
  schema: any,
  options: StandardToolOptions
): [any, any] {
  if (serializer == null) {
    serializer = createMarkdownSerializer(options);
    parser = createMarkdownParser(schema, options);
  }

  return [serializer, parser];
}
