import { ProseMirrorTool } from "@dc-extension-rich-text/common";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight } from "@material-ui/icons";
import React from "react";

import { ContentNodeWithPos, findParentNode } from 'prosemirror-utils';

function getContainingTextBlock(state: any): ContentNodeWithPos | undefined {
  const result = findParentNode((node) => node.isTextblock)(state.selection);

  return result;
}

function align(state: any, dispatch: ((tr: any) => void) | undefined, alignment: string): boolean {
  // Apply align attr to the text block.
  const result = getContainingTextBlock(state);
  
  if (result != null) {
    const { node, pos } = result;

    const tr = state.tr.setNodeMarkup(pos, node.type, { ...node.attrs, align: alignment });

    if (dispatch) {
      dispatch(tr);
    }
  }

  return true;
}

function alignActive(state: any, view: any, alignment: string): boolean {
    // Apply align attr to the text block.
    const result = getContainingTextBlock(state);
  
    if (result != null) {
      return (result.node.attrs.align || "left") === alignment;
    }

    return false;
}

function alignable(state: any, view: any): boolean {
  // Any text block is alignable.
  return getContainingTextBlock(state) != null;
}

export function AlignLeftTool(schema: any): ProseMirrorTool {
  return {
    name: "align_left",
    label: "Align Left",
    displayIcon: <FormatAlignLeft />,
    apply: (state: any, dispatch?: (tr: any) => void) => align(state, dispatch, "left"),
    isActive: (state: any, view: any) => alignActive(state, view, "left"),
    isVisible: alignable,
  };
}

export function AlignCenterTool(schema: any): ProseMirrorTool {
  return {
    name: "align_center",
    label: "Align center",
    displayIcon: <FormatAlignCenter />,
    apply: (state: any, dispatch?: (tr: any) => void) => align(state, dispatch, "center"),
    isActive: (state: any, view: any) => alignActive(state, view, "center"),
    isVisible: alignable,
  };
}

export function AlignRightTool(schema: any): ProseMirrorTool {
  return {
    name: "align_right",
    label: "Align Right",
    displayIcon: <FormatAlignRight />,
    apply: (state: any, dispatch?: (tr: any) => void) => align(state, dispatch, "right"),
    isActive: (state: any, view: any) => alignActive(state, view, "right"),
    isVisible: alignable,
  };
}

export function AlignJustifyTool(schema: any): ProseMirrorTool {
  return {
    name: "align_justify",
    label: "Align Justify",
    displayIcon: <FormatAlignJustify />,
    apply: (state: any, dispatch?: (tr: any) => void) => align(state, dispatch, "justify"),
    isActive: (state: any, view: any) => alignActive(state, view, "justify"),
    isVisible: alignable,
  };
}
