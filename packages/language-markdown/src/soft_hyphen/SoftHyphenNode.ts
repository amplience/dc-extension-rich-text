/**
 * Non-standard tool for applying a css class name to a region of the document
 */

// tslint:disable-next-line
export const soft_hyphen = {
  group: "inline",
  inline: true,
  parseDOM: [
    {
      tag: "span[data-shy]",
      getAttrs(dom: any): any {
        return {};
      }
    }
  ],
  toDOM(node: any): any {
    return [
      "span",
      { "data-shy": true },
      "-"
    ];
  }
};
