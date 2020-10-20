import React from "react";

import { canInsert, clearAllMarks, getSelectionMarks, isMarkActive } from "../utils";

// tslint:disable:no-submodule-imports
import CalendarViewDay from "@material-ui/icons/CalendarViewDay";
import Code from "@material-ui/icons/Code";
import FormatBold from "@material-ui/icons/FormatBold";
import FormatClearIcon from '@material-ui/icons/FormatClear';
import FormatIndentDecrease from "@material-ui/icons/FormatIndentDecrease";
import FormatItalic from "@material-ui/icons/FormatItalic";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import FormatQuote from "@material-ui/icons/FormatQuote";
import ImageIcon from "@material-ui/icons/Image";
import Link from "@material-ui/icons/Link";
import Redo from "@material-ui/icons/Redo";
import Undo from "@material-ui/icons/Undo";

import { Hyperlink, Image } from "../dialogs";
import { ProseMirrorTool } from "./ProseMirrorTool";
import { isToolEnabled, StandardToolOptions } from "./StandardToolOptions";

// tslint:disable-next-line
const { undo: undoFn, redo: redoFn } = require("prosemirror-history");
// tslint:disable-next-line
const { toggleMark, setBlockType, lift } = require("prosemirror-commands");
// tslint:disable-next-line
const { wrapInList } = require("prosemirror-schema-list");
// tslint:disable-next-line
const { findParentNode } = require("prosemirror-utils");

export function createMarkToggleTool(
  name: string,
  label: string,
  icon: React.ReactElement,
  type: any
): ProseMirrorTool {
  return {
    name,
    label,
    displayIcon: icon,
    isActive: (state: any) => isMarkActive(state, type),
    apply: toggleMark(type)
  };
}

export function undo(): ProseMirrorTool {
  return {
    name: "undo",
    label: "Undo",
    displayIcon: <Undo />,
    isEnabled: (state: any) => undoFn(state),
    apply: undoFn
  };
}

export function redo(): ProseMirrorTool {
  return {
    name: "redo",
    label: "Redo",
    displayIcon: <Redo />,
    isEnabled: (state: any) => redoFn(state),
    apply: redoFn
  };
}

export function strong(schema: any): ProseMirrorTool {
  return createMarkToggleTool(
    "strong",
    "Bold",
    <FormatBold />,
    schema.marks.strong
  );
}

export function em(schema: any): ProseMirrorTool {
  return createMarkToggleTool(
    "em",
    "Italic",
    <FormatItalic />,
    schema.marks.em
  );
}

export function code(schema: any): ProseMirrorTool {
  return createMarkToggleTool("code", "Code", <Code />, schema.marks.code);
}

export function editLink(
  type: any,
  dialog?: (value?: Hyperlink) => Promise<Hyperlink>
): (state: any, dispatch: any, view: any) => Promise<void> {
  return async (state: any, dispatch: any, view: any): Promise<void> => {
    const marks = getSelectionMarks(state).filter(mark => mark.mark.type === type);
    const attrs: Hyperlink | undefined = marks.length === 1 ? marks[0].mark.attrs : undefined;

    if (dialog) {
      try {
        const linkValue = await dialog(attrs);

        const newAttrs = {
          href: linkValue.href,
          title: linkValue.title === "" ? undefined : linkValue.title
        };

        if (marks.length > 0 && newAttrs.href !== "") {
          const { tr, selection } = state;
          if (selection.from === selection.to) {
            dispatch(tr.addMark(marks[0].from, marks[0].to, type.create(newAttrs)));
          } else {
            dispatch(tr.addMark(selection.from, selection.to, type.create(newAttrs)));
          }
        } else {
          toggleMark(type, newAttrs)(state, dispatch, view);
        }

        return;
        // tslint:disable-next-line
      } catch (err) { /* Clear the link instead */ }
    }

    if (isMarkActive(state, type)) {
      toggleMark(type)(state, dispatch, view);
      return;
    }
  };
}

export function link(
  schema: any,
  dialog?: (value?: Hyperlink) => Promise<Hyperlink>
): ProseMirrorTool {
  return {
    name: "link",
    label: "Add or remove Link",
    displayIcon: <Link />,
    isActive: (state: any) => isMarkActive(state, schema.marks.link),
    isEnabled: (state: any) => {
      return !state.selection.empty || getSelectionMarks(state).filter(mark => mark.mark.type === schema.marks.link).length > 0;
    },
    apply: editLink(schema.marks.link, dialog)
  };
}

export function insertImage(
  type: any,
  dialog?: (value?: Image) => Promise<Image>
): (state: any, dispatch: any, view: any) => Promise<void> {
  return async (state: any, dispatch: any, view: any): Promise<void> => {
    if (dialog) {
      try {
        const imageValue = await dialog();

        view.dispatch(
          view.state.tr.replaceSelectionWith(
            type.createAndFill({
              src: imageValue.src,
              title: imageValue.title === "" ? undefined : imageValue.title,
              alt: imageValue.alt === "" ? undefined : imageValue.alt
            })
          )
        );
        // tslint:disable-next-line
      } catch (err) { }
    }
  };
}

export function image(
  schema: any,
  dialog?: (value?: Image) => Promise<Image>
): ProseMirrorTool {
  return {
    name: "image",
    label: "Insert Image from URL",
    displayIcon: <ImageIcon />,
    apply: insertImage(schema.nodes.image, dialog)
  };
}

export function lift_tool(schema: any): ProseMirrorTool {
  return {
    name: "lift",
    label: "Decrease Indentation",
    displayIcon: <FormatIndentDecrease />,
    isVisible: (state: any) => lift(state),
    apply: lift
  };
}

export function bullet_list(schema: any): ProseMirrorTool {
  return {
    name: "bullet_list",
    label: "Bullet List",
    displayIcon: <FormatListBulleted />,
    isEnabled: (state: any) => wrapInList(schema.nodes.bullet_list, {})(state),
    apply: wrapInList(schema.nodes.bullet_list, {})
  };
}

export function ordered_list(schema: any): ProseMirrorTool {
  return {
    name: "ordered_list",
    label: "Ordered List",
    displayIcon: <FormatListNumbered />,
    isEnabled: (state: any) => wrapInList(schema.nodes.ordered_list, {})(state),
    apply: wrapInList(schema.nodes.ordered_list, {})
  };
}

export function blockquote(schema: any): ProseMirrorTool {
  return {
    name: "blockquote",
    label: "Quote",
    displayIcon: <FormatQuote />,
    isEnabled: (state: any) => wrapInList(schema.nodes.blockquote, {})(state),
    apply: wrapInList(schema.nodes.blockquote, {})
  };
}

function getCurrentAlignment(state: any): object {
  if (state == null) {
    return {};
  }

  // Locate the block we're contained in.
  const parent = findParentNode((x: any): boolean => x.attrs.align)(state.selection);

  if (parent != null) {
    return { align: parent.node.attrs.align };
  } else {
    return {};
  }
}

function blockTypeCommand(state: any, type: any, attrs?: any): any {
  return setBlockType(type, { ...attrs, ...getCurrentAlignment(state) });
}

export function heading(schema: any, level: number): ProseMirrorTool {
  return {
    name: "heading_" + level,
    label: "Heading " + level,
    displayLabel: React.createElement(
      `h${level}`,
      { style: { margin: 0 } },
      `Heading ${level}`
    ),
    apply: (state: any, dispatch: any, view: any) => blockTypeCommand(state, schema.nodes.heading, { level })(state, dispatch, view),
    isEnabled: (state: any) => blockTypeCommand(state, schema.nodes.heading, { level })(state),
    isActive: (state: any, view: any) => !blockTypeCommand(state, schema.nodes.heading, { level })(state, null, view)
  };
}

export function paragraph(schema: any): ProseMirrorTool {
  const command = setBlockType(schema.nodes.paragraph);
  return {
    name: "paragraph",
    label: "Normal text",
    displayLabel: (
      <p style={{ margin: 0, padding: 0, display: "inline" }}>Normal text</p>
    ),
    apply: (state: any, dispatch: any, view: any) => blockTypeCommand(state, schema.nodes.paragraph)(state, dispatch, view),
    isEnabled: (state: any) => blockTypeCommand(state, schema.nodes.paragraph)(state),
    isActive: (state: any, view: any) => !blockTypeCommand(state, schema.nodes.paragraph)(state, null, view)
  };
}

export function code_block(schema: any): ProseMirrorTool {
  const command = setBlockType(schema.nodes.code_block);
  return {
    name: "code_block",
    label: "Code Block",
    displayLabel: <code>Code Block</code>,
    displayIcon: <Code />,
    apply: command,
    isEnabled: (state: any) => command(state),
    isActive: (state: any, view: any) => !command(state, null, view)
  };
}

export function horizontal_rule(schema: any): ProseMirrorTool {
  return {
    name: "horizontal_rule",
    label: "Insert Horizontal Rule",
    displayIcon: <CalendarViewDay />,
    apply: (state: any, dispatch: any) => {
      dispatch(
        state.tr.replaceSelectionWith(schema.nodes.horizontal_rule.create())
      );
    },
    isEnabled: (state: any) => canInsert(state, schema.nodes.horizontal_rule)
  };
}

export function clear_formatting(): ProseMirrorTool {
  return {
    name: "clear_formatting",
    label: "Clear Formatting",
    displayIcon: <FormatClearIcon />,
    apply: clearAllMarks(),
    isEnabled: (state: any) => {
      // are there any marks?
      return true;
    }
  };
}

export function createStandardTools(
  schema: any,
  options: StandardToolOptions
): ProseMirrorTool[] {
  const tools: ProseMirrorTool[] = [];

  if (isToolEnabled('undo', options)) {
    tools.push(undo());
  }

  if (isToolEnabled('redo', options)) {
    tools.push(redo());
  }

  if (isToolEnabled('strong', options) && schema.marks.strong) {
    tools.push(strong(schema));
  }

  if (isToolEnabled('em', options) && schema.marks.em) {
    tools.push(em(schema));
  }

  if (isToolEnabled('code', options) && schema.marks.code) {
    tools.push(code(schema));
  }

  if (isToolEnabled('link', options) && schema.marks.link) {
    tools.push(link(schema, options.dialogs ? options.dialogs.getHyperlink : undefined));
  }
  
  if (isToolEnabled('lift', options)) {
    tools.push(lift_tool(schema));
  }

  if (isToolEnabled('bullet_list', options) && schema.nodes.bullet_list) {
    tools.push(bullet_list(schema));
  }

  if (isToolEnabled('ordered_list', options) && schema.nodes.ordered_list) {
    tools.push(ordered_list(schema));
  }

  if (isToolEnabled('image', options) && schema.nodes.image) {
    tools.push(image(schema, options.dialogs ? options.dialogs.getImage : undefined));
  }

  if (isToolEnabled('blockquote', options) && schema.nodes.blockquote) {
    tools.push(blockquote(schema));
  }

  if (isToolEnabled('heading', options) && schema.nodes.heading) {
    for (let i = 1; i < 7; i++) {
      tools.push(heading(schema, i));
    }
  }

  if (isToolEnabled('paragraph', options) && schema.nodes.paragraph) {
    tools.push(paragraph(schema));
  }

  if (isToolEnabled('code_block', options) && schema.nodes.code_block) {
    tools.push(code_block(schema));
  }

  if (isToolEnabled('horizontal_rule', options) && schema.nodes.horizontal_rule) {
    tools.push(horizontal_rule(schema));
  }

  if (isToolEnabled('clear_formatting', options)) {
    tools.push(clear_formatting());
  }

  return tools;
}
