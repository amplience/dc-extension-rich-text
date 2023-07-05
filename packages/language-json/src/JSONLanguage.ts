import {
  createStandardTools,
  isToolEnabled,
  ProseMirrorTool,
  RichLanguage,
  StandardToolOptions,
} from "@dc-extension-rich-text/common";
import {
  createMarkdownParser,
  createMarkdownSerializer,
  createMarkdownTools,
  MarkdownLanguage,
} from "@dc-extension-rich-text/language-markdown";
import {
  createDynamicContentTools,
  DcContentLinkNode,
  DcImageLinkNode,
  DynamicContentToolOptions,
} from "@dc-extension-rich-text/prosemirror-dynamic-content";
import { Block, BlockConverter } from "./blocks/Block";
import DcContentLinkBlock from "./blocks/DcContentLinkBlock";
import DcImageLinkBlock from "./blocks/DcImageLinkBlock";
import MarkdownBlock from "./blocks/MarkdownBlock";
// tslint:disable-next-line
const { Schema } = require("prosemirror-model");

// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export default class JSONLanguage extends MarkdownLanguage {
  public name: string = "json";
  public label: string = "JSON";
  private blockTypes: BlockConverter[];
  private markdownBlock: MarkdownBlock;

  constructor(
    options: DynamicContentToolOptions = {},
    blockTypes?: BlockConverter[]
  ) {
    super(options);

    this.markdownBlock = new MarkdownBlock(options, this);
    this.blockTypes = blockTypes || [
      new DcImageLinkBlock(),
      new DcContentLinkBlock(),
      this.markdownBlock,
    ];

    this.tools = [
      ...this.tools,
      ...createDynamicContentTools(this.schema, options),
    ];
  }

  public serialize(doc: any): Block[] {
    if (!doc) {
      return [];
    }

    doc = doc.toJSON();

    const fragments: any[] = [];
    if (!doc.content || doc.content.length === 0) {
      return fragments;
    }

    const nodesByConverter = groupBy(doc.content, (node: any):
      | BlockConverter
      | undefined => {
      for (const blockType of this.blockTypes) {
        if (blockType.canSerialize(this.schema, node)) {
          return blockType;
        }
      }
    });

    let blocks: Block[] = [];

    for (const group of nodesByConverter) {
      const groupBlocks = group.group.serialize(this.schema, group.items);
      blocks = blocks.concat.apply(blocks, groupBlocks);
    }

    return blocks;
  }

  public parse(blocks: any): any {
    if (!blocks || blocks.length === 0) {
      return Node.fromJSON(this.schema, {
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      });
    }

    const result: any = {
      type: "doc",
      content: [],
    };

    const blocksGroupedByConverter = groupBy(blocks, (block: Block):
      | BlockConverter
      | undefined => {
      for (const blockType of this.blockTypes) {
        if (blockType.canParse(this.schema, block)) {
          return blockType;
        }
      }
    });

    for (const group of blocksGroupedByConverter) {
      const parsedNodes = group.group.parse(this.schema, group.items);
      result.content = result.content.concat.apply(result.content, parsedNodes);
    }

    return Node.fromJSON(this.schema, result);
  }

  protected createSchema(options: StandardToolOptions): any {
    const schema = super.createSchema(options);
    return new Schema({
      nodes: schema.spec.nodes
        .addBefore("image", "dc-image-link", DcImageLinkNode())
        .addBefore("image", "dc-content-link", DcContentLinkNode()),
      marks: schema.spec.marks,
    });
  }

  protected getNodeSerializers(): any {
    return {
      "dc-image-link": () => "",
      "dc-content-linl": () => "",
    };
  }
}

function groupBy<T, G>(
  items: T[],
  groupFn: (item: T) => G | undefined
): Array<{ group: G; items: T[] }> {
  const result: Array<{ group: G; items: T[] }> = [];

  let currentGroup: G | null = null;
  let currentGroupItems: T[] = [];

  for (const item of items) {
    const itemGroup = groupFn(item);
    if (itemGroup === undefined) {
      continue;
    }

    if (currentGroup === null) {
      currentGroup = itemGroup;
      currentGroupItems = [item];
    } else if (currentGroup === itemGroup) {
      currentGroupItems.push(item);
    } else {
      if (currentGroupItems.length > 0) {
        result.push({
          group: currentGroup,
          items: currentGroupItems,
        });
      }

      currentGroup = itemGroup;
      currentGroupItems = [item];
    }
  }

  if (currentGroupItems.length > 0 && currentGroup !== null) {
    result.push({
      group: currentGroup,
      items: currentGroupItems,
    });
  }

  return result;
}
