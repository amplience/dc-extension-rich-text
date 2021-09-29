import { StandardToolOptions } from "@dc-extension-rich-text/common";
import { AlignedHeaderToMarkdown, AlignedParagraphToMarkdown } from "../alignment/AlignmentPlugin";
import { AnchorToMarkdown } from "../anchor";
import { InlineStylesToMarkdown } from "../inline_styles";
import { LinkToMarkdown } from "../link/LinkPlugin";
import { SoftHyphenToMarkdown } from "../soft_hyphen";
import { TableToMarkdown } from "../tables/TableToMarkdown";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");

export function escape(text: string): string {
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

const TextToMarkdown = {
  text(state: any, node: any): void {
    state.text(escape(node.text));
  }
}

export function createMarkdownSerializer(options: StandardToolOptions): any {
  return new markdown.MarkdownSerializer(
        {
          ...markdown.defaultMarkdownSerializer.nodes,
          ...SoftHyphenToMarkdown,
          ...AnchorToMarkdown,
          ...TableToMarkdown,
          ...AlignedParagraphToMarkdown(options),
          ...AlignedHeaderToMarkdown(options),
          ...TextToMarkdown
        },
        {
          ...markdown.defaultMarkdownSerializer.marks,
          ...InlineStylesToMarkdown,
          ...LinkToMarkdown
        }
      );
}
