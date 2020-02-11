export const InlineStylesToMarkdown = {
  inline_styles: {
    open(state: any, mark: any, parent: any, index: number): string {
      const attrs: any = {};
      if (mark.attrs.class) {
        attrs.class = mark.attrs.class;
      }

      const attrsSerialized = Object.keys(attrs)
        .map(key => `${key}="${attrs[key]}"`)
        .join(" ");

      if (attrsSerialized.length > 0) {
        return `<span ${attrsSerialized}>`;
      } else {
        return `<span>`;
      }
    },
    close: "</span>"
  }
};
