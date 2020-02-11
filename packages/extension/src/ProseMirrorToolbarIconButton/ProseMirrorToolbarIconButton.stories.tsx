import { storiesOf } from "@storybook/react";
import React from "react";

import { ProseMirrorToolbarContext } from "../ProseMirrorToolbar";

// tslint:disable-next-line
import FormatBold from "@material-ui/icons/FormatBold";
import ProseMirrorToolbarIconButton from "./ProseMirrorToolbarIconButton";

storiesOf("ProseMirrorToolbarIconButton", module)
  .add("Default", () => (
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
      <ProseMirrorToolbarIconButton toolName="strong" />
    </ProseMirrorToolbarContext.Provider>
  ))

  .add("Active", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Bold",
            content: <FormatBold />,
            active: true,
            enabled: true,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarIconButton toolName="strong" />
    </ProseMirrorToolbarContext.Provider>
  ))

  .add("Disabled", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Bold",
            content: <FormatBold />,
            active: false,
            enabled: false,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarIconButton toolName="strong" />
    </ProseMirrorToolbarContext.Provider>
  ));
