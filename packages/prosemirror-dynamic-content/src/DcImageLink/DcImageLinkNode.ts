export function DcImageLinkNode(): any {
  return {
    content: "block",
    group: "block",
    defining: true,
    attrs: {
      value: {}
    },
    nodeSize: 1,
    draggable: true,
    atom: true,
    parseDOM: [
      {
        tag: "dc-image-link[data-dc-image-link]",
        getAttrs(dom: any): any {
          const value = JSON.parse(dom.getAttribute("data-dc-image-link"));
          return {
            value
          };
        }
      }
    ],
    toDOM(node: any): any {
      const { value } = node.attrs;
      return ["dc-image-link", { "data-dc-image-link": JSON.stringify(value) }];
    }
  };
}
