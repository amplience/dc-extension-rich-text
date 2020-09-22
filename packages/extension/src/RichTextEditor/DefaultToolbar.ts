import { ToolbarElement } from "../ProseMirrorToolbar";

export default [
  {
    type: "group",
    children: [
      { type: "button", toolName: "undo" },
      { type: "button", toolName: "redo" }
    ]
  },

  {
    type: "dropdown",
    label: "Styles",
    toolNames: [
      "paragraph",
      "heading_1",
      "heading_2",
      "heading_3",
      "heading_4",
      "heading_5",
      "heading_6",
      "code_block"
    ]
  },

  {
    type: "group",
    children: [
      { type: "button", toolName: "strong" },
      { type: "button", toolName: "em" },
      { type: "button", toolName: "link" }
    ]
  },

  {
    type: "group",
    children: [
      { type: "button", toolName: "lift" },
      { type: "button", toolName: "bullet_list" },
      { type: "button", toolName: "ordered_list" }
    ]
  },

  {
    type: "group",
    children: [
      { type: "button", toolName: "dc-image-link" },
      { type: "button", toolName: "image" },
      { type: "button", toolName: "dc-content-link" },
      { type: "button", toolName: "blockquote" },
      { type: "button", toolName: "code_block" },
      { type: "button", toolName: "anchor" },
      { type: "button", toolName: "soft_hyphen" },
      { type: "button", toolName: "horizontal_rule" }
    ]
  },

  {
    type: "group",
    children: [{ type: "button", toolName: "clear_formatting" }]
  }
] as ToolbarElement[];
