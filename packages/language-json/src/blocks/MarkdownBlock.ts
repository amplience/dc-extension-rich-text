import { StandardToolOptions } from "@dc-extension-rich-text/common";
import { MarkdownLanguage } from "@dc-extension-rich-text/language-markdown";
import { Block, BlockConverter } from "./Block";

// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export default class MarkdownBlock implements BlockConverter {
  constructor(
    private options: StandardToolOptions,
    private markdownLanguage: MarkdownLanguage
  ) {}

  public canSerialize(schema: any, node: any): boolean {
    return this.markdownLanguage.canSerializeNodeToMarkdown(schema, node);
  }

  public serialize(schema: any, nodes: any[]): Block[] {
    const parsedNodes = Node.fromJSON(schema, {
      type: "doc",
      content: nodes
    });

    return [
      {
        type: "markdown",
        data: this.markdownLanguage.serializeMarkdown(parsedNodes)
      }
    ];
  }

  public canParse(schema: any, block: Block): boolean {
    return block.type === "markdown";
  }

  public parse(schema: any, blocks: Block[]): any[] {
    let result: any[] = [];
    blocks.forEach(block => {
      const doc = this.markdownLanguage
        .parseMarkdown(block.data || "")
        .toJSON();
      result = result.concat.apply(result, doc.content || []);
    });
    return result;
  }
}
