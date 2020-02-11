import { storiesOf } from "@storybook/react";
import React from "react";

import { ProseMirrorToolbarContext } from "../ProseMirrorToolbar";
import ProseMirrorToolbarDropdown from "./ProseMirrorToolbarDropdown";

storiesOf("ProseMirrorToolbarDropDown", module)
  .add("Dropdown", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Bold",
            active: false,
            enabled: true,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarDropdown toolNames={["strong", "strong", "strong"]} />
    </ProseMirrorToolbarContext.Provider>
  ))

  .add("Dropdown with selected value", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Bold",
            active: true,
            enabled: true,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarDropdown toolNames={["strong", "strong", "strong"]} />
    </ProseMirrorToolbarContext.Provider>
  ))

  .add("Dropdown with custom content", () => (
    <ProseMirrorToolbarContext.Provider
      value={{
        getToolState: (toolName: string) => {
          return {
            name: "strong",
            label: "Heading 1",
            content: <h1 style={{ margin: 0 }}>Heading 1</h1>,
            active: true,
            enabled: true,
            visible: true
          };
        }
      }}
    >
      <ProseMirrorToolbarDropdown toolNames={["strong", "strong", "strong"]} />
    </ProseMirrorToolbarContext.Provider>
  ));
