import { storiesOf } from "@storybook/react";
import React from "react";

import { isMarkActive } from "@dc-extension-rich-text/common";
import ProseMirror from "../ProseMirror/ProseMirror";
import ProseMirrorToolbar, { ToolbarElement } from "./ProseMirrorToolbar";

// tslint:disable-next-line
import { ProseMirrorTool } from "@dc-extension-rich-text/common";
// tslint:disable-next-line
import FormatBold from "@material-ui/icons/FormatBold";
import { computeToolbarState, ProseMirrorToolbarState } from "./ProseMirrorToolbarState";

// tslint:disable-next-line
const schema = require("prosemirror-schema-basic").schema;
// tslint:disable-next-line
const { toggleMark } = require("prosemirror-commands");

const tools: ProseMirrorTool[] = [
  {
    name: "strong",
    label: "Bold",
    displayIcon: <FormatBold />,
    isActive: (state: any) => isMarkActive(state, schema.marks.strong),
    apply: toggleMark(schema.marks.strong)
  }
];

const layout: ToolbarElement[] = [
  {
    type: "button",
    toolName: "strong"
  },

  {
    type: "group",
    children: [
      {
        type: "button",
        toolName: "strong"
      },
      {
        type: "button",
        toolName: "strong"
      }
    ]
  },

  {
    type: "dropdown",
    toolNames: ["strong"]
  }
];

const Editor: React.SFC<{}> = (props: any) => {
  const [toolbarState, setToolbarState] = React.useState<ProseMirrorToolbarState>();

  const handleUpdateState = React.useCallback(
    (state: any, view: any) => {
      const newToolbarState = computeToolbarState(tools, state, view, {} as any);
      setToolbarState(newToolbarState);
    },
    [setToolbarState]
  );

  return (
    <div>
      <ProseMirrorToolbar toolbarState={toolbarState} layout={layout} />
      <ProseMirror schema={schema} onUpdateState={handleUpdateState} />
    </div>
  );
};

storiesOf("ProseMirrorToolbar", module).add("Component", () => <Editor />);
