/**
 * Non-standard tool for applying a css class name to a region of the document
 */

// tslint:disable-next-line
export const inline_styles = {
  attrs: {
    class: { default: "" },
    style: { default: "" }
  },
  group: "inline",
  parseDOM: [
    {
      tag: "span",
      getAttrs: (node: any) => {
        return {
          class: node.getAttribute("class"),
          style: node.attributes.style.value
        };
      }
    }
  ],
  toDOM: (mark: any) => {
    return [
      "span",
      {
        ...(mark.attrs.style ? { style: mark.attrs.style } : {}),
        class: mark && mark.attrs && mark.attrs.class ? mark.attrs.class : ""
      },
      0
    ];
  }
};
