// tslint:disable-next-line
export const paragraph_align = {
  content: "inline*",
  attrs: {
    align: { default: "left" }
  },
  group: "block",
  parseDOM: [
    {
      tag: "p", 
      getAttrs(dom: any): object { 
        return { align: dom.getAttribute("align") };
      }
    }
  ],
  toDOM(node: any): object { return ["p", { align: (node.attrs.align || "left") }, 0] }
};

function getHeadingAttrs(level: number): (dom: any) => object {
  return function getAttrs(dom: any): object { 
    return { align: dom.getAttribute("align"), level };
  }
}

// tslint:disable-next-line
export const heading_align = {
  attrs: {
    level: { default: 1 },
    align: { default: "left" }
  },
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [{tag: "h1", getAttrs: getHeadingAttrs(1)},
             {tag: "h2", getAttrs: getHeadingAttrs(2)},
             {tag: "h3", getAttrs: getHeadingAttrs(3)},
             {tag: "h4", getAttrs: getHeadingAttrs(4)},
             {tag: "h5", getAttrs: getHeadingAttrs(5)},
             {tag: "h6", getAttrs: getHeadingAttrs(6)}],
  toDOM(node: any): object { return ["h" + node.attrs.level, { align: (node.attrs.align || "left") }, 0] }
}

export const AlignedParagraphToMarkdown = {
  paragraph(state: any, node: any): void {
    if (node.attrs.align && node.attrs.align !== "left") {
      // Aligned paragraph
      // Emit paragraph as HTML with the align attribute.

      state.write(`<p align="${node.attrs.align}">`);
      state.renderInline(node);
      state.write("</p>");
      state.closeBlock(node);
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  },
};

export const AlignedHeaderToMarkdown = {
  heading(state: any, node: any): void {
    if (node.attrs.align && node.attrs.align !== "left") {
      // Aligned header
      // Emit header as HTML with the align attribute.

      state.write(`<h${node.attrs.level} align="${node.attrs.align}">`);
      state.renderInline(node);
      state.write(`</h${node.attrs.level}>`);
      state.closeBlock(node);
    } else {
      state.write(state.repeat("#", node.attrs.level) + " ")
      state.renderInline(node)
      state.closeBlock(node)
    }
  },
};