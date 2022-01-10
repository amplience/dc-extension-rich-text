import { getDefaultClass, StandardToolOptions } from "@dc-extension-rich-text/common";
import { html_block } from "../alignment";
import { soft_hyphen_from } from "../soft_hyphen";

// tslint:disable-next-line
const markdown = require("prosemirror-markdown");
// tslint:disable-next-line
const markdownit = require("markdown-it");
// tslint:disable-next-line
var { markdownItTable } = require('markdown-it-table');

export function createMarkdownParser(
  schema: any,
  options: StandardToolOptions
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
    fence: {
      block: "code_block",
      getAttrs: (tok: any) => ({ params: tok.info || "" }),
      noCloseToken: true
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

    const isTag = content.length > 2 && content[0] === '<' && content[content.length-1] === '>';
    if (isTag) {
      const isOpen = content[1] !== '/';
      const nameStart = isOpen ? 1 : 2;
      const interiorLength = content.length - (nameStart + 1);
      const selfClosing = content[content.length-2] === '/';
      let tagName = selfClosing ? content.substr(nameStart, interiorLength - 1) : content.substr(nameStart, interiorLength);
      const spaceInd = tagName.indexOf(' ');

      if (spaceInd > -1) {
        tagName = tagName.substr(0, spaceInd);
      }

      if (isOpen) {
        switch (tagName.toLowerCase()) {
          case 'span':
            {
              const dom = new DOMParser().parseFromString(token.content, "text/html");
              const tag = dom.body.firstChild;
        
              if (!tag) {
                return;
              }
              
              if (tag.nodeName.toLowerCase() === "span") {
                const className = (tag as Element).getAttribute("class");
                state.openMark(
                  schema.marks.inline_styles.create({
                    class: className
                  })
                );
              }
            }
            break;
          case 'a':
            {
              const dom = new DOMParser().parseFromString(token.content, "text/html");
              const tag = dom.body.firstChild;

              if (!tag) {
                return;
              }

              if (tag.nodeName.toLowerCase() === "a") {
                const href = (tag as Element).getAttribute("href");
                const target = (tag as Element).getAttribute("target");
                const title = (tag as Element).getAttribute("title");

                const id = (tag as Element).getAttribute("id");
                
                if (id != null) {
                  
                  state.addNode(schema.nodes.anchor, {
                    value: id
                  });
                } else {
                  state.openMark(
                    schema.marks.link.create({
                      href: href,
                      title: title,
                      target: target
                    })
                  );
                }
              }
            }
            break;
          case 'br':
            state.addNode(schema.nodes.hard_break);
            break;
        }
      } else {
        switch (tagName.toLowerCase()) {
          case 'span':
            state.closeMark(schema.marks.inline_styles);
            break;
          case 'a':
            state.closeMark(schema.marks.link);
            break;
        }
      }
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

  const alignmentClasses = new Map<string, string>([
    ["amp-align-left", "left"],
    ["amp-align-center", "center"],
    ["amp-align-right", "right"],
    ["amp-align-justify", "justify"]
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

    const classAttr = token.meta.attrs.find((attr: Attr) => attr.name === 'class') as Attr;
    if (classAttr) {
      // Styles may be present in classes instead
      (classAttr.ownerElement as HTMLElement).classList.forEach(value => {
        const asDefault = getDefaultClass(value, options);
        
        alignAttr = alignmentClasses.get(asDefault) || 'left';
      });
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
