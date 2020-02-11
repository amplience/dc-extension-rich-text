export function DcContentLinkNode(): any {
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
        tag: "dc-content-link[data-dc-content-link]",
        getAttrs(dom: any): any {
          const value = JSON.parse(dom.getAttribute("data-dc-content-link"));
          return {
            value
          };
        }
      }
    ],
    toDOM(node: any): any {
      const { value } = node.attrs;
      return [
        "dc-content-link",
        { "data-dc-content-link": JSON.stringify(value) }
      ];
    }
  };
}
