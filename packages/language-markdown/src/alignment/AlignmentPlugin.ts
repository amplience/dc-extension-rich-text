import {
  getCustomClass,
  StandardToolOptions
} from "@dc-extension-rich-text/common";

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
        return { align: dom.style.textAlign };
      }
    }
  ],
  toDOM(node: any): object {
    return ["p", { style: `text-align: ${node.attrs.align || "left"}` }, 0];
  }
};

function getHeadingAttrs(level: number): (dom: any) => object {
  return function getAttrs(dom: any): object {
    return { align: dom.style.textAlign, level };
  };
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
  parseDOM: [
    { tag: "h1", getAttrs: getHeadingAttrs(1) },
    { tag: "h2", getAttrs: getHeadingAttrs(2) },
    { tag: "h3", getAttrs: getHeadingAttrs(3) },
    { tag: "h4", getAttrs: getHeadingAttrs(4) },
    { tag: "h5", getAttrs: getHeadingAttrs(5) },
    { tag: "h6", getAttrs: getHeadingAttrs(6) }
  ],
  toDOM(node: any): object {
    return [
      "h" + node.attrs.level,
      { style: `text-align: ${node.attrs.align || "left"}` },
      0
    ];
  }
};

export const AlignedParagraphToMarkdown = (options: StandardToolOptions) => ({
  paragraph(state: any, node: any): void {
    if (
      node.attrs.align &&
      node.attrs.align !== "left" &&
      node.attrs.align !== "start"
    ) {
      // Aligned paragraph
      // Emit paragraph as HTML with the align attribute.

      if (options.useClasses) {
        state.write(
          `<p class="${getCustomClass(
            `amp-align-${node.attrs.align}`,
            options
          )}">`
        );
      } else {
        state.write(`<p style="text-align: ${node.attrs.align}">`);
      }
      state.renderInline(node);
      state.write("</p>");
      state.closeBlock(node);
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  }
});

export const AlignedParagraphToMarkdownWithDiv = (options: StandardToolOptions) => ({
  paragraph(state: any, node: any): void {
    if (state.delim === '> ') {
      // use default behavior inside blockquotes
      AlignedParagraphToMarkdown(options).paragraph(state, node);
      return;
    }
    if (
      node.attrs.align &&
      node.attrs.align !== "left" &&
      node.attrs.align !== "start"
    ) {
      if (options.useClasses) {
        state.write(
          `<div class="${getCustomClass(
            `amp-align-${node.attrs.align}`,
            options
          )}">\n\n`
        );
      } else {
        state.write(`<div style="text-align: ${node.attrs.align}">\n\n`);
      }
      state.renderInline(node);
      state.write("\n\n</div>");
      state.closeBlock(node);
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  }
})

export const AlignedHeaderToMarkdown = (options: StandardToolOptions) => ({
  heading(state: any, node: any): void {
    if (
      node.attrs.align &&
      node.attrs.align !== "left" &&
      node.attrs.align !== "start"
    ) {
      // Aligned header
      // Emit header as HTML with the align attribute.

      if (options.useClasses) {
        state.write(
          `<h${node.attrs.level} class="${getCustomClass(
            `amp-align-${node.attrs.align}`,
            options
          )}">`
        );
      } else {
        state.write(
          `<h${node.attrs.level} style="text-align: ${node.attrs.align}">`
        );
      }
      state.renderInline(node);
      state.write(`</h${node.attrs.level}>`);
      state.closeBlock(node);
    } else {
      state.write(state.repeat("#", node.attrs.level) + " ");
      state.renderInline(node);
      state.closeBlock(node);
    }
  }
});

export const AlignedHeaderToMarkdownWithDiv = (options: StandardToolOptions) => ({
  heading(state: any, node: any): void {
    if (state.delim === '> ') {
      // use default behavior inside blockquotes
      AlignedHeaderToMarkdown(options).heading(state, node);
      return;
    }
    if (
      node.attrs.align &&
      node.attrs.align !== "left" &&
      node.attrs.align !== "start"
    ) {
      if (options.useClasses) {
        state.write(
          `<div class="${getCustomClass(
            `amp-align-${node.attrs.align}`,
            options
          )}">\n\n`
        );
      } else {
        state.write(`<div style="text-align: ${node.attrs.align}">\n\n`);
      }
      state.write(state.repeat("#", node.attrs.level) + " ");
      state.renderInline(node);
      state.write("\n\n</div>");
      state.closeBlock(node);
    } else {
      state.write(state.repeat("#", node.attrs.level) + " ");
      state.renderInline(node);
      state.closeBlock(node);
    }
  }
})