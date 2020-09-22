import { canInsert, ProseMirrorTool } from "@dc-extension-rich-text/common";
import Remove from "@material-ui/icons/Remove";
import React from "react";

export function SoftHyphenTool(schema: any): ProseMirrorTool {
  return {
    name: "soft_hyphen",
    label: "Insert Soft Hyphen",
    displayIcon: <Remove />,
    apply: (state: any, dispatch: any) => {
      dispatch(state.tr.replaceSelectionWith(schema.nodes.soft_hyphen.create()));
    },
    isEnabled: (state: any) => canInsert(state, schema.nodes.soft_hyphen),
  };
}
