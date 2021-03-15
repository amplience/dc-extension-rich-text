import { Anchor, canInsert, ProseMirrorTool } from "@dc-extension-rich-text/common";
import Directions from "@material-ui/icons/Directions";
import React from "react";

export function AnchorTool(
  schema: any,
  dialog?: (existing: Set<string>, value?: Anchor) => Promise<Anchor>
): ProseMirrorTool {
  return {
    name: "anchor",
    label: "Insert Anchor",
    displayIcon: <Directions />,
    apply: insertAnchor(schema.nodes.anchor, dialog),
    isEnabled: (state: any) => canInsert(state, schema.nodes.anchor),
  };
}

export function insertAnchor(
  type: any,
  dialog?: (existing: Set<string>, value?: Anchor) => Promise<Anchor>
): (state: any, dispatch: any, view: any) => Promise<void> {
  return async (state: any, dispatch: any, view: any): Promise<void> => {
    if (dialog) {
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

        const anchorValue = await dialog(existingAnchors);

        view.dispatch(
          view.state.tr.replaceSelectionWith(
            type.createAndFill({
              value: anchorValue.value
            })
          )
        );
        // tslint:disable-next-line
      } catch (err) { }
    }
  };
}