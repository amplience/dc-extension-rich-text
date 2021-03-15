import {
  createStandardTools,
  isToolEnabled,
  ProseMirrorTool,
  RichLanguage
} from "@dc-extension-rich-text/common";
import {
  createMarkdownTools
} from "@dc-extension-rich-text/language-markdown";
import {
  createDynamicContentTools,
  DynamicContentToolOptions
} from "@dc-extension-rich-text/prosemirror-dynamic-content";
import { Block, BlockConverter } from "./blocks/Block";
import DcContentLinkBlock from "./blocks/DcContentLinkBlock";
import DcImageLinkBlock from "./blocks/DcImageLinkBlock";
import MarkdownBlock from "./blocks/MarkdownBlock";
import { createSchema } from "./schema/createSchema";

// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export default class JSONLanguage implements RichLanguage {
  public name: string = "json";
  public label: string = "JSON";
  public schema: any;
  public tools: ProseMirrorTool[];

  constructor(
    options: DynamicContentToolOptions = {},
    private blockTypes: BlockConverter[] = [
      new MarkdownBlock(options),
      new DcImageLinkBlock(),
      new DcContentLinkBlock()
    ]
  ) {
    const isInlineStylesEnabled = isToolEnabled("inline_styles", options);
    const schema = createSchema(options, isInlineStylesEnabled);

    const tools = [
      ...createStandardTools(schema, options),
      ...createDynamicContentTools(schema, options),
      ...createMarkdownTools(schema, options)
    ];

    this.schema = schema;
    this.tools = tools;
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
            type: "paragraph"
          }
        ]
      });
    }

    const result: any = {
      type: "doc",
      content: []
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
          items: currentGroupItems
        });
      }

      currentGroup = itemGroup;
      currentGroupItems = [item];
    }
  }

  if (currentGroupItems.length > 0 && currentGroup !== null) {
    result.push({
      group: currentGroup,
      items: currentGroupItems
    });
  }

  return result;
}
