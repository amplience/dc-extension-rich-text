import { StandardToolOptions } from "@dc-extension-rich-text/common";
import {
  AlignedHeaderToMarkdown,
  AlignedParagraphToMarkdown,
} from "../alignment/AlignmentPlugin";
import { AnchorToMarkdown } from "../anchor";
import { InlineStylesToMarkdown } from "../inline_styles";
import { SoftHyphenToMarkdown } from "../soft_hyphen";
import { TableToMarkdown } from "../tables/TableToMarkdown";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const TextToMarkdown = {
  text(state: any, node: any): void {
    state.text(escape(node.text));
  },
};

export function createMarkdownSerializer(
  options: StandardToolOptions,
  serializers: Record<string, any> = {}
): any {
  const defaultMarkdownSerializer = new markdown.MarkdownSerializer(
    {
      ...markdown.defaultMarkdownSerializer.nodes,
      ...SoftHyphenToMarkdown,
      ...AnchorToMarkdown,
      ...TableToMarkdown,
      ...AlignedParagraphToMarkdown(options),
      ...AlignedHeaderToMarkdown(options),
      ...TextToMarkdown,
      ...serializers,
    },
    {
      ...markdown.defaultMarkdownSerializer.marks,
      ...InlineStylesToMarkdown,
    }
  );

  defaultMarkdownSerializer.marks.link = {
    open(state: any, mark: any) {
      state.write("[");
      return "";
    },
    close(state: any, mark: any) {
      // Add type annotations
      const { href, title, target } = mark.attrs;
      let result = `](${href}`;
      if (title) result += ` "${title}"`;
      result += ")";

      // Convert to HTML if target is set
      if (target) {
        const rel = mark.attrs.rel ? ` rel="${mark.attrs.rel}"` : "";
        result = `<a href="${href}"${title ? ` title="${title}"` : ""}${
          target ? ` target="${target}"` : ""
        }${rel}>${state.out.slice(state.delim)}</a>`;
        state.out = state.out.slice(0, state.delim);
      }

      return result;
    },
  };

  return defaultMarkdownSerializer;
}
