import { html_block } from "../alignment";
import { soft_hyphen_from } from "../soft_hyphen";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");
// tslint:disable-next-line
const markdownit = require("markdown-it");
// tslint:disable-next-line
var { markdownItTable } = require('markdown-it-table');

export function createMarkdownParser(
  schema: any
): any {
  const md = markdownit("commonmark", { html: true });
  md.use(markdownItTable);

  md.inline.ruler.before("text", "soft_hyphen", soft_hyphen_from);
  md.block.ruler.before("html_block", "html_block", html_block);

  // Patch parser to detect <span></span> tags and convert into inline_styles marks
  // Warning... this might be a little brittle
  const parser = new markdown.MarkdownParser(schema, md, {
    ...markdown.defaultMarkdownParser.tokens,
    anchor: {
      node: "anchor",
      getAttrs: (tok: any) => ({
        value: tok.attrGet("value"),
      }),
    },
    soft_hyphen: { node: "soft_hyphen" },
    table: { block: "table" },
    th: { block: "table_header",
      getAttrs: (tok: any) => ({
        style: tok.attrGet("style"),
      }),
    },
    tr: { block: "table_row" },
    td: { block: "table_cell",
      getAttrs: (tok: any) => ({
        style: tok.attrGet("style"),
      }),
    }
  });

  parser.tokenHandlers.html_inline = (state: any, token: any) => {
    if (!token || !token.content) {
      return;
    }

    const content: string = (token.content || "").trim();

    if (content.startsWith("<span") && content.endsWith(">")) {
      const dom = new DOMParser().parseFromString(token.content, "text/html");
      const tag = dom.body.firstChild;

      if (!tag) {
        return;
      }

      if (tag.nodeName.toLowerCase() === "span") {
        const className = (tag as Element).getAttribute("class");
        state.openMark(
          schema.marks.inline_styles.create({
            class: className,
          })
        );
      }
    } else if (content === "</span>") {
      state.closeMark(schema.marks.inline_styles);
    } else if (content.startsWith("<a") && content.endsWith(">")) {
      const dom = new DOMParser().parseFromString(token.content, "text/html");
      const tag = dom.body.firstChild;

      if (!tag) {
        return;
      }

      if (tag.nodeName.toLowerCase() === "a") {
        const id = (tag as Element).getAttribute("id");

        if (id != null) {
          state.addNode(schema.nodes.anchor, {
            value: id,
          });
        }
      }
    } else if (content === "<br>") {
      state.addNode(schema.nodes.hard_break);
    }
  };

  const alignedParagraphTypes = new Map<string, string>([
    ["P", "paragraph"],
    ["H1", "heading"],
    ["H2", "heading"],
    ["H3", "heading"],
    ["H4", "heading"],
    ["H5", "heading"],
    ["H6", "heading"],
  ])

  // tslint:disable-next-line
  parser.tokenHandlers.html_block_open = (state: any, token: any) => {
    if (!alignedParagraphTypes.has(token.meta.tag)) {
      return;
    }

    const styleAttr = token.meta.attrs.find((attr: Attr) => attr.name === 'style') as Attr;
    let alignAttr = 'left';
    if (styleAttr) {
      alignAttr = (styleAttr.ownerElement as HTMLElement).style.textAlign || alignAttr;
    }

    const nodeType = alignedParagraphTypes.get(token.meta.tag) as string;

    const level = (nodeType === 'heading') ? Number(token.meta.tag[1]) : undefined;    
    state.openNode(schema.nodes[nodeType], { align: alignAttr ? alignAttr : 'left', level });
  };

  // tslint:disable-next-line
  parser.tokenHandlers.html_block_close = (state: any, token: any) => {
    if (alignedParagraphTypes.has(token.meta.tag)) {
      state.closeNode();
    }
  };

  return parser;
}
