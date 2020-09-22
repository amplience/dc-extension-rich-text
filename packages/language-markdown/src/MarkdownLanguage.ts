import {
  createStandardTools,
  isToolEnabled,
  ProseMirrorTool,
  RichLanguage,
  StandardToolOptions,
} from "@dc-extension-rich-text/common";
import { AnchorTool } from "./anchor";
import { createInlineStylesTools } from "./inline_styles";
import { createMarkdownParser } from "./markdown/MarkdownParser";
import { createMarkdownSerializer } from "./markdown/MarkdownSerializer";
import { createSchema } from "./schema/createSchema";
import { SoftHyphenTool } from "./soft_hyphen";

export function createMarkdownTools(schema: any, options: StandardToolOptions): ProseMirrorTool[] {
  let tools: ProseMirrorTool[] = [];

  if (isToolEnabled("inline_styles", options)) {
    tools = tools.concat(tools, createInlineStylesTools(schema, options));
  }

  if (isToolEnabled("anchor", options) && schema.nodes.anchor) {
    tools.push(AnchorTool(schema, options.dialogs ? options.dialogs.getAnchor : undefined));
  }

  if (isToolEnabled("soft_hyphen", options) && schema.nodes.soft_hyphen) {
    tools.push(SoftHyphenTool(schema));
  }

  return tools;
}

export default class MarkdownLanguage implements RichLanguage {
  public name: string = "markdown";
  public label: string = "Markdown";
  public schema: any;
  public tools: ProseMirrorTool[];

  private serializer: any;
  private parser: any;

  constructor(options: StandardToolOptions = {}) {
    const isInlineStylesEnabled = isToolEnabled("inline_styles", options);

    const schema = createSchema(isInlineStylesEnabled);
    const tools = [
      ...createStandardTools(schema, options),
      ...createMarkdownTools(schema, options)
    ]

    const serializer = createMarkdownSerializer();
    const parser = createMarkdownParser(schema);

    this.schema = schema;
    this.tools = tools;
    this.serializer = serializer;
    this.parser = parser;
  }

  public serialize(doc: any): any {
    return this.serializer.serialize(doc);
  }

  public parse(data: any): any {
    if (!data) {
      data = "";
    }
    return this.parser.parse(data);
  }
}
