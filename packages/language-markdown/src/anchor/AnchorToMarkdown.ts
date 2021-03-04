export const AnchorToMarkdown = {
  anchor(state: any, node: any): void {
    const attrs: any = {};
    if (node.attrs.value) {
      attrs.id = node.attrs.value;
    }

    const attrsSerialized = Object.keys(attrs)
      .map((key) => `${key}="${attrs[key]}"`)
      .join(" ");

    state.write(`<a ${attrsSerialized}></a>`);
  },
};
