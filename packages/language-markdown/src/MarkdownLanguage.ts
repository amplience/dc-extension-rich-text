import {
  createStandardTools,
  isToolEnabled,
  ProseMirrorTool,
  RichLanguage,
  StandardToolOptions
} from "@dc-extension-rich-text/common";
import { createInlineStylesTools } from "./inline_styles";
import { createMarkdownParser } from "./markdown/MarkdownParser";
import { createMarkdownSerializer } from "./markdown/MarkdownSerializer";
import { createSchema } from "./schema/createSchema";

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
    let tools = createStandardTools(schema, options);

    if (isInlineStylesEnabled) {
      tools = tools.concat(tools, createInlineStylesTools(schema, options));
    }

    const serializer = createMarkdownSerializer(isInlineStylesEnabled);
    const parser = createMarkdownParser(schema, isInlineStylesEnabled);

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
