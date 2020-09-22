/**
 * Non-standard tool for applying a css class name to a region of the document
 */

// tslint:disable-next-line
export const anchor = {
  group: "inline",
  inline: true,
  attrs: {
    value: {}
  },
  parseDOM: [
    {
      tag: "a[name]",
      getAttrs(dom: any): any {
        const value = JSON.parse(dom.getAttribute("name"));
        return {
          value
        };
      }
    }
  ],
  toDOM(node: any): any {
    const { value } = node.attrs;
    return [
      "a",
      { "name": JSON.stringify(value) },
      value
    ];
  }
};
