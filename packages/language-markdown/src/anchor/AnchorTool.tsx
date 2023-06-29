import { Anchor, canInsert, ProseMirrorTool, RichTextEditorContextProps } from "@dc-extension-rich-text/common";
import {Directions} from "@material-ui/icons";
import React from "react";

export function AnchorTool(
  schema: any
): ProseMirrorTool {
  return {
    name: "anchor",
    label: "Insert Anchor",
    displayIcon: <Directions />,
    apply: insertAnchor(schema.nodes.anchor),
    isEnabled: (state: any) => canInsert(state, schema.nodes.anchor),
  };
}

export function insertAnchor(
  type: any
): (state: any, dispatch: any, richTextEditorContext: RichTextEditorContextProps) => Promise<void> {
  return async (state: any, dispatch: any, richTextEditorContext: RichTextEditorContextProps): Promise<void> => {
    try {
      const existingAnchors = new Set<string>();

      let addAnchor: (node: any) => void;

      addAnchor = (node: any): void => {
        if (node.type.name === 'anchor') {
          existingAnchors.add(node.attrs.value);
        } else {
          node.forEach(addAnchor);
        }
      }

      state.doc.forEach(addAnchor);

      // Any anchor node in the existing selection will be replaced.
      const { $from, $to } = state.selection;
      state.doc.nodesBetween($from.pos, $to.pos, (node: any, start: number) => {
        if (node.type.name === 'anchor') {
          existingAnchors.delete(node.attrs.value);
        }
      });

      const anchorValue = await richTextEditorContext.dialogs.getAnchor(existingAnchors);

      dispatch(
        state.tr.replaceSelectionWith(
          type.createAndFill({
            value: anchorValue.value
          })
        )
      );
      // tslint:disable-next-line
    } catch (err) { }
  };
}