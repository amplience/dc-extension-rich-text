// tslint:disable-next-line
export const anchor = {
  group: "inline",
  inline: true,
  attrs: {
    value: {}
  },
  parseDOM: [
    {
      tag: "a[id]",
      getAttrs(dom: any): any {
        const value = JSON.parse(dom.getAttribute("id"));
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
      { "id": JSON.stringify(value) },
      value
    ];
  }
};
