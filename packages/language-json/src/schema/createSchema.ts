import { StandardToolOptions } from "@dc-extension-rich-text/common";
import { createSchema as createMarkdownSchema } from "@dc-extension-rich-text/language-markdown";
import {
  DcContentLinkNode,
  DcImageLinkNode
} from "@dc-extension-rich-text/prosemirror-dynamic-content";

// tslint:disable-next-line
const { Schema } = require("prosemirror-model");

export function createSchema(options: StandardToolOptions, isInlineStylesEnabled: boolean): any {
  const schema = createMarkdownSchema(options, isInlineStylesEnabled);
  return new Schema({
    nodes: schema.spec.nodes
      .addBefore("image", "dc-image-link", DcImageLinkNode())
      .addBefore("image", "dc-content-link", DcContentLinkNode()),
    marks: schema.spec.marks
  });
}
