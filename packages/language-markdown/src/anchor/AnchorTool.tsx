import { Anchor, canInsert, ProseMirrorTool } from "@dc-extension-rich-text/common";
import Directions from "@material-ui/icons/Directions";
import React from "react";

export function AnchorTool(
  schema: any,
  dialog?: (value?: Anchor) => Promise<Anchor>
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
  dialog?: (value?: Anchor) => Promise<Anchor>
): (state: any, dispatch: any, view: any) => Promise<void> {
  return async (state: any, dispatch: any, view: any): Promise<void> => {
    if (dialog) {
      try {
        const anchorValue = await dialog();

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