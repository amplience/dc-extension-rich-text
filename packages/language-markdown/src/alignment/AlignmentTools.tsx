import { ProseMirrorTool } from "@dc-extension-rich-text/common";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight } from "@material-ui/icons";
import React from "react";

import { ContentNodeWithPos, findParentNode } from 'prosemirror-utils';

function getContainingTextBlocks(state: any): ContentNodeWithPos[] {
  const resultNodes = new Set<any>();
  const result: ContentNodeWithPos[] = [];

  state.doc.nodesBetween(state.selection.from, state.selection.to, (node: any, pos: number, parent: any, index: number) => {
    if (node.isTextblock && !resultNodes.has(node)) {
      result.push({node, pos, start: 0, depth: 0});
      resultNodes.add(node);
    }
  });

  return Array.from(result);
}

function align(state: any, dispatch: ((tr: any) => void) | undefined, alignment: string): boolean {
  // Apply align attr to the text block.
  const result = getContainingTextBlocks(state);
  let tr = state.tr;
  
  result.forEach(item => {
    const { node, pos } = item;

    tr = tr.setNodeMarkup(pos, node.type, { ...node.attrs, align: alignment });
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}

function alignActive(state: any, view: any, alignment: string): boolean {
  // Apply align attr to the text block.
  const result = getContainingTextBlocks(state);
  let anyMismatch = false;

  result.forEach(item => {
    if ((result[0].node.attrs.align || "left") !== alignment) {
      anyMismatch = true;
    }
  });

  if (result.length === 0) {
    return false;
  }

  return !anyMismatch;
}

function alignable(state: any, view: any): boolean {
  // Any text block is alignable.
  return getContainingTextBlocks(state).length > 0;
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
