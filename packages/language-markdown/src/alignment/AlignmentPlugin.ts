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

export const AlignedToMarkdown = (options: StandardToolOptions) => {
  const alignedToMd = (state: any, node: any): void => {
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
          )}">`
        );
      } else {
        state.write(`<div style="text-align: ${node.attrs.align}">`);
      }
      state.ensureNewLine();
      state.renderInline(node);
      state.ensureNewLine();
      state.write("</div>");
      state.closeBlock(node);
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  }
  return {
    paragraph: alignedToMd,
    heading: alignedToMd
  }
};

