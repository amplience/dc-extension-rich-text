import React from "react";

import {
  Toolbar as MaterialToolbar,
  WithStyles,
  withStyles
} from "@material-ui/core";

import { ProseMirrorToolbarContext } from ".";
import { ProseMirrorToolbarIconButton } from "../ProseMirrorToolbarIconButton";

import ProseMirrorToolbarDropdown from "../ProseMirrorToolbarDropdown/ProseMirrorToolbarDropdown";
import { ProseMirrorToolbarGroup } from "../ProseMirrorToolbarGroup";
import { useRichTextEditorContext } from "../RichTextEditor/RichTextEditorContext";
import { ProseMirrorToolbarState } from "./ProseMirrorToolbarState";

const styles = {
  root: {
    minHeight: 35,
    borderBottom: "1px solid rgb(218, 220, 224)"
  }
};

export interface ToolbarButton {
  type: "button";
  toolName: string;
}

export interface ToolbarDropDown {
  type: "dropdown";
  label?: string;
  toolNames: string[];
}

export interface ToolbarGroup {
  type: "group";
  children: ToolbarElement[];
}

export type ToolbarElement = ToolbarButton | ToolbarGroup | ToolbarDropDown;

export interface ProseMirrorToolbarProps extends WithStyles<typeof styles> {
  toolbarState: ProseMirrorToolbarState | undefined;
  layout: ToolbarElement[];
  isLocked?: boolean;
}

const ProseMirrorToolbar: React.SFC<ProseMirrorToolbarProps> = (
  props: ProseMirrorToolbarProps
) => {
  const { classes, layout, toolbarState } = props;
  const richTextEditorContext = useRichTextEditorContext();

  const renderToolbarElement = (element: ToolbarElement) => {
    switch (element.type) {
      case "button":
        return (
          <ProseMirrorToolbarIconButton
            toolName={element.toolName}
            isLocked={props.isLocked}
          />
        );
      case "dropdown":
        return (
          <ProseMirrorToolbarDropdown
            toolNames={element.toolNames}
            label={element.label}
            isLocked={props.isLocked}
          />
        );
      case "group":
        const toolVisible = (tool: ToolbarButton): boolean => {
          const state =
            toolbarState == null
              ? null
              : toolbarState.toolStates[tool.toolName];
          return state == null ? true : state.visible;
        };

        const anyVisible =
          element.children.findIndex(
            child => child.type !== "button" || toolVisible(child)
          ) !== -1;
        return anyVisible ? (
          <ProseMirrorToolbarGroup>
            {element.children.map(child => renderToolbarElement(child))}
          </ProseMirrorToolbarGroup>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <ProseMirrorToolbarContext.Provider
      value={{
        applyTool: (toolName: string) => {
          if (!toolbarState) {
            return;
          }

          const tool = toolbarState.tools.find(x => x.name === toolName);
          const areInlineStyles = Object.keys(toolbarState.toolStates).filter(
            (x: any) =>
              /inline_styles/.test(x) && toolbarState.toolStates[x].active
          );
          if (!tool) {
            return;
          }

          if (areInlineStyles && areInlineStyles.length) {
            const clearFormatting = toolbarState.tools.find(
              x => x.name === "clear_formatting"
            );

            if (clearFormatting) {
              clearFormatting.apply(
                richTextEditorContext.proseMirrorEditorView.state,
                richTextEditorContext.proseMirrorEditorView.dispatch,
                richTextEditorContext
              );
            }
          }

          tool.apply(
            richTextEditorContext.proseMirrorEditorView.state,
            richTextEditorContext.proseMirrorEditorView.dispatch,
            richTextEditorContext
          );
        },
        getToolState: (toolName: string) => {
          if (!toolbarState) {
            return undefined;
          }

          return toolbarState.toolStates[toolName];
        }
      }}
    >
      <MaterialToolbar className={classes.root} disableGutters={true}>
        {layout.map(value => {
          return renderToolbarElement(value);
        })}
      </MaterialToolbar>
    </ProseMirrorToolbarContext.Provider>
  );
};

export default withStyles(styles)(ProseMirrorToolbar);
