// HTML block

"use strict";

const blockNames = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "meta",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "section",
  "source",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];

const attrName = "[a-zA-Z_:][a-zA-Z0-9:._-]*";

const unquoted = "[^\"'=<>`\\x00-\\x20]+";
const singleQuoted = "'[^']*'";
const doubleQuoted = '"[^"]*"';

const attrValue =
  "(?:" + unquoted + "|" + singleQuoted + "|" + doubleQuoted + ")";

const attribute = "(?:\\s+" + attrName + "(?:\\s*=\\s*" + attrValue + ")?)";
const openTag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
const closeTag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";

const HTML_OPEN_CLOSE_TAG_RE = new RegExp(
  "^(?:" + openTag + "|" + closeTag + ")"
);

// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
const HTML_SEQUENCES: Array<[RegExp, RegExp, boolean]> = [
  [/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true],
  [/^<!--/, /-->/, true],
  [/^<\?/, /\?>/, true],
  [/^<![A-Z]/, />/, true],
  [/^<!\[CDATA\[/, /\]\]>/, true],
  [
    new RegExp("^</?(" + blockNames.join("|") + ")(?=(\\s|/?>|$))", "i"),
    /^$/,
    true
  ],
  [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
];

export function html_block(
  state: any,
  startLine: number,
  endLine: number,
  silent: boolean
): boolean {
  let i;
  let nextLine;
  let token;
  let lineText;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }

  if (!state.md.options.html) {
    return false;
  }

  if (state.src.charCodeAt(pos) !== 0x3c /* < */) {
    return false;
  }

  lineText = state.src.slice(pos, max);

  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    if (HTML_SEQUENCES[i][0].test(lineText)) {
      break;
    }
  }

  if (i === HTML_SEQUENCES.length) {
    return false;
  }

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return HTML_SEQUENCES[i][2];
  }

  nextLine = startLine + 1;

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  if (!HTML_SEQUENCES[i][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      if (HTML_SEQUENCES[i][1].test(lineText)) {
        if (lineText.length !== 0) {
          nextLine++;
        }
        break;
      }
    }
  }

  const content = state.getLines(startLine, nextLine, state.blkIndent, true);
  const dom = new DOMParser().parseFromString(content, "text/html");
  const tag = dom.body.firstChild as Element;

  const innerContent = tag == null ? "" : tag.innerHTML;

  state.line = nextLine;

  token = state.push("html_block_open", "div", 1);
  token.meta = { tag: tag.tagName, attrs: Array.from(tag.attributes) };
  token.map = [startLine, state.line];

  state.md.block.parse(innerContent, state.md, state.env, state.tokens);
  token.map = [startLine, nextLine];
  token.content = innerContent;
  token.children = [];

  token = state.push("html_block_close", "div", -1);
  token.meta = { tag: tag.tagName };

  return true;
}
