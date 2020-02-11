import { storiesOf } from "@storybook/react";
import React from "react";

import { ProseMirrorToolbarContext } from "../ProseMirrorToolbar";

// tslint:disable-next-line
import FormatBold from "@material-ui/icons/FormatBold";
import { ProseMirrorToolbarGroup } from ".";
import { ProseMirrorToolbarIconButton } from "../ProseMirrorToolbarIconButton";

storiesOf("ProseMirrorToolbarGroup", module)
  .add("Component", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Bold",
            content: <FormatBold />,
            active: false,
            enabled: true,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarGroup>
        <ProseMirrorToolbarIconButton toolName="strong" />
        <ProseMirrorToolbarIconButton toolName="strong" />
      </ProseMirrorToolbarGroup>
    </ProseMirrorToolbarContext.Provider>
  ))

  .add("Empty", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Bold",
            content: <FormatBold />,
            active: false,
            enabled: true,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarGroup />
    </ProseMirrorToolbarContext.Provider>
  ));
