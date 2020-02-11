import { Block, BlockConverter } from "./Block";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");
// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export default class DcContentLinkBlock implements BlockConverter {
  public canSerialize(schema: any, node: any): boolean {
    return node.type === "dc-content-link";
  }

  public serialize(schema: any, nodes: any[]): Block[] {
    return nodes.map(node => {
      return {
        type: "dc-content-link",
        data: node.attrs.value
      };
    });
  }

  public canParse(schema: any, block: Block): boolean {
    return block.type === "dc-content-link";
  }

  public parse(schema: any, blocks: Block[]): any[] {
    const result: any[] = [];
    blocks.forEach(block => {
      result.push({
        type: "dc-content-link",
        attrs: {
          value: block.data
        }
      });
    });
    return result;
  }
}
