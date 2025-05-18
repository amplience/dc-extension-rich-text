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

function cleanPositionMarkers(text: string): string {
  return text.replace(/\\\\\\n|((\\n|\n)\d+)+/g, (match) =>
    match === "\\\\\\n" ? "\\\\n" : match.startsWith("\\n") ? "\\n" : "\n\n"
  );
}

const TextToMarkdown = {
  text(state: any, node: any): void {
    const cleanedText = node.text ? cleanPositionMarkers(node.text) : node.text;
    state.text(escape(cleanedText));
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
      state.delim = state.out.length;
      return "";
    },
    close(state: any, mark: any) {
      const { href, title, target, rel } = mark.attrs;
      const linkText = state.out.slice(state.delim);
      let result = `](${href}`;

      if (title) result += ` "${title}"`;
      result += ")";

      if (target || rel) {
        const relAttr = rel ? ` rel="${rel}"` : "";
        result = `<a href="${href}"${title ? ` title="${title}"` : ""}${
          target ? ` target="${target}"` : ""
        }${relAttr}>${linkText}</a>`;

        state.out = state.out.slice(0, state.delim - 1);
      }

      return result;
    },
  };

  const originalSerialize = defaultMarkdownSerializer.serialize;
  defaultMarkdownSerializer.serialize = function(doc: any): string {
    const output = originalSerialize.call(this, doc);
    return cleanPositionMarkers(output);
  };

  return defaultMarkdownSerializer;
}
