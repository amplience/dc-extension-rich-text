// tslint:disable-next-line
const markdown = require("prosemirror-markdown");
// tslint:disable-next-line
const markdownit = require("markdown-it");

export function createMarkdownParser(
  schema: any,
  isInlineStylesEnabled: boolean = false
): any {
  if (!isInlineStylesEnabled) {
    return markdown.defaultMarkdownParser;
  }

  // Patch parser to detect <span></span> tags and convert into inline_styles marks
  // Warning... this might be a little brittle
  const parser = new markdown.MarkdownParser(
    schema,
    markdownit("commonmark", { html: true }),
    {
      ...markdown.defaultMarkdownParser.tokens
    }
  );

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
            class: className
          })
        );
      }
    } else if (content === "</span>") {
      state.closeMark(schema.marks.inline_styles);
    }
  };

  // tslint:disable-next-line
  parser.tokenHandlers.html_block = () => {};

  return parser;
}
