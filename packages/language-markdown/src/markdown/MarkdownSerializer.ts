import { InlineStylesToMarkdown } from "../inline_styles";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");

export function createMarkdownSerializer(
  isInlineStylesEnabled: boolean = false
): any {
  return !isInlineStylesEnabled
    ? markdown.defaultMarkdownSerializer
    : new markdown.MarkdownSerializer(
        markdown.defaultMarkdownSerializer.nodes,
        {
          ...markdown.defaultMarkdownSerializer.marks,
          ...InlineStylesToMarkdown
        }
      );
}
