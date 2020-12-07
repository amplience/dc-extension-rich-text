import { Block, BlockConverter } from "./Block";
import { getDefaultSerializerParser } from '@dc-extension-rich-text/language-markdown';
import { StandardToolOptions } from "@dc-extension-rich-text/common";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");

// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export default class MarkdownBlock implements BlockConverter {
  private serializer: any;
  private parser: any;

  constructor(private options: StandardToolOptions) {

  }

  public canSerialize(schema: any, node: any): boolean {
    this.ensureInit(schema);
    if (!node.type) {
      return false;
    } else {
      return this.serializer.nodes[node.type] != null;
    }
  }

  public serialize(schema: any, nodes: any[]): Block[] {
    this.ensureInit(schema);
    const parsedNodes = Node.fromJSON(schema, {
      type: "doc",
      content: nodes
    });

    return [
      {
        type: "markdown",
        data: this.serializer.serialize(parsedNodes)
      }
    ];
  }

  public canParse(schema: any, block: Block): boolean {
    return block.type === "markdown";
  }

  public parse(schema: any, blocks: Block[]): any[] {
    this.ensureInit(schema);
    let result: any[] = [];
    blocks.forEach(block => {
      const doc = this.parser.parse(block.data || '').toJSON();
      result = result.concat.apply(result, doc.content || []);
    });
    return result;
  }

  private ensureInit(schema: any): void {
    [this.serializer, this.parser] = getDefaultSerializerParser(schema, this.options);
  }
}
