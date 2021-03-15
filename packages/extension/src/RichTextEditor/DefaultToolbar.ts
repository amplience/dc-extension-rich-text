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
      { type: "button", toolName: "soft_hyphen" },
      { type: "button", toolName: "link" },
      { type: "button", toolName: "anchor" },
    ]
  },

  {
    type: "group",
    children: [
      { type: "button", toolName: "align_left" },
      { type: "button", toolName: "align_center" },
      { type: "button", toolName: "align_right" },
      { type: "button", toolName: "align_justify" }
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
      { type: "button", toolName: "horizontal_rule" },
      { type: "button", toolName: "table_create" }
    ]
  },

  {
    type: "group",
    children: [
      { type: "button", toolName: "table_row_add" },
      { type: "button", toolName: "table_row_delete" },
      { type: "button", toolName: "table_col_add" },
      { type: "button", toolName: "table_col_delete" },
      { type: "button", toolName: "table_delete" },
      { type: "button", toolName: "clear_formatting" }
    ]
  }
] as ToolbarElement[];
