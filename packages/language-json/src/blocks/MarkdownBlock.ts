import { Block, BlockConverter } from "./Block";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");

// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export default class MarkdownBlock implements BlockConverter {
  public canSerialize(schema: any, node: any): boolean {
    if (!node.type) {
      return false;
    } else {
      return markdown.defaultMarkdownSerializer.nodes[node.type] != null;
    }
  }

  public serialize(schema: any, nodes: any[]): Block[] {
    const parsedNodes = Node.fromJSON(schema, {
      type: "doc",
      content: nodes
    });

    return [
      {
        type: "markdown",
        data: markdown.defaultMarkdownSerializer.serialize(parsedNodes)
      }
    ];
  }

  public canParse(schema: any, block: Block): boolean {
    return block.type === "markdown";
  }

  public parse(schema: any, blocks: Block[]): any[] {
    let result: any[] = [];
    blocks.forEach(block => {
      const doc = markdown.defaultMarkdownParser.parse(block.data || '').toJSON();
      result = result.concat.apply(result, doc.content || []);
    });
    return result;
  }
}
