import React from "react";

import {
  Button,
  Toolbar as MaterialToolbar,
  Tooltip,
  WithStyles,
  createStyles,
  withStyles,
} from "@material-ui/core";

import { ProseMirrorToolbarContext } from ".";
import { ProseMirrorToolbarIconButton } from "../ProseMirrorToolbarIconButton";

import ProseMirrorToolbarDropdown from "../ProseMirrorToolbarDropdown/ProseMirrorToolbarDropdown";
import { ProseMirrorToolbarGroup } from "../ProseMirrorToolbarGroup";
import { useRichTextEditorContext } from "../RichTextEditor/RichTextEditorContext";
import { ProseMirrorToolbarState } from "./ProseMirrorToolbarState";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";
import { Loader } from "../Loader/Loader";

const styles = createStyles({
  root: {
    minHeight: 35,
    borderBottom: "1px solid rgb(218, 220, 224)",
    flexWrap: "wrap",
  },
  group: {
    display: "flex",
  },
  button: {
    color: "#333",
    height: 26,
    alignSelf: "center",
    textTransform: "none",
    fontSize: 13,
    textAlign: "center",
  },
  divider: {
    borderRight: "1px solid rgb(218, 220, 224)",
    height: 13,
    margin: "9px 4px",
  },
  tooltip: {
    fontSize: 12,
    backgroundColor: "#1A222D",
    maxWidth: 340
  },
  arrow: {
    color: "#1A222D",
  },
});

const tooltips = {
  ai: {
    title: "Use ChatGPT to improve your copy"
  },
  contentStudio: {
    title: "Generate on-brand content at scale with Content Studio"
  }
}

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
  params: Record<string, unknown>;
}

const ProseMirrorToolbar: React.SFC<ProseMirrorToolbarProps> = (
  props: ProseMirrorToolbarProps
) => {
  const { classes, layout, toolbarState, params } = props;
  const richTextEditorContext = useRichTextEditorContext();
  const group1 = layout.slice(0, 3);
  const group2 = layout.slice(3);
  const isAiToolEnabled =
    (params?.tools as { ai: { disabled: boolean } })?.ai?.disabled !== true;
  const isContentStudioEnabled = (params?.tools as { contentStudio: { disabled: boolean } })?.contentStudio?.disabled !== true;

  const renderToolbarElement = (idx: number, element: ToolbarElement) => {
    switch (element.type) {
      case "button":
        return (
          <ProseMirrorToolbarIconButton
            toolName={element.toolName}
            isLocked={props.isLocked}
            key={idx}
          />
        );
      case "dropdown":
        return (
          <ProseMirrorToolbarDropdown
            toolNames={element.toolNames}
            label={element.label}
            isLocked={props.isLocked}
            key={idx}
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
            (child) => child.type !== "button" || toolVisible(child)
          ) !== -1;
        return anyVisible ? (
          <ProseMirrorToolbarGroup key={idx}>
            {element.children.map((child, idx) =>
              renderToolbarElement(idx, child)
            )}
          </ProseMirrorToolbarGroup>
        ) : null;
      default:
        return null;
    }
  };

  const showAIGenerateDialog = async () => {
    try {
      const {
        prompt,
        keywords,
      } = await richTextEditorContext.dialogs.getAIPrompt({
        variant: "generate",
      });
      await richTextEditorContext.actions.insertAIContent(prompt, keywords);
    } catch {}
  };

  const launchContentStudio = async () => {
    await richTextEditorContext.actions.insertContentStudioContent();
  };

  return (
    <ProseMirrorToolbarContext.Provider
      value={{
        applyTool: (toolName: string) => {
          if (!toolbarState) {
            return;
          }

          const tool = toolbarState.tools.find((x) => x.name === toolName);
          const areInlineStyles = Object.keys(toolbarState.toolStates).filter(
            (x: any) =>
              /inline_styles/.test(x) && toolbarState.toolStates[x].active
          );
          if (!tool) {
            return;
          }

          if (areInlineStyles && areInlineStyles.length) {
            const clearFormatting = toolbarState.tools.find(
              (x) => x.name === "clear_formatting"
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
        },
      }}
    >
      <MaterialToolbar className={classes.root} disableGutters={true}>
        <div className={classes.group}>
          {isContentStudioEnabled ? (
            <>
            <Tooltip 
              title={tooltips.contentStudio.title} 
              arrow 
              classes={{
                arrow: props.classes.arrow,
                tooltip: props.classes.tooltip,
              }}
            >
              <Button
                disabled={richTextEditorContext.isLocked}
                onClick={launchContentStudio}
                className={classes.button}
                size="small"
                startIcon={
                  !richTextEditorContext.isLocked && (
                    <SparklesIcon
                      style={{ width: 15, height: 15 }}
                      variant="content-studio"
                    ></SparklesIcon>
                  )
                }
              >
                {richTextEditorContext.isLocked ? (
                  <Loader></Loader>
                ) : (
                  "Content Studio"
                )}
              </Button>
            </Tooltip>
            <div className={classes.divider}></div>
          </>
          ) : (
            ""
          )}
          {isAiToolEnabled ? (
            <>
              <Tooltip 
                title={tooltips.ai.title} 
                arrow 
                classes={{
                  arrow: props.classes.arrow,
                  tooltip: props.classes.tooltip,
                }}
              >
                <Button
                  disabled={richTextEditorContext.isLocked}
                  onClick={showAIGenerateDialog}
                  className={classes.button}
                  size="small"
                  startIcon={
                    !richTextEditorContext.isLocked && (
                      <SparklesIcon
                        style={{ width: 15, height: 15 }}
                      ></SparklesIcon>
                    )
                  }
                >
                  {richTextEditorContext.isLocked ? (
                    <Loader></Loader>
                  ) : (
                    "AI Assistant"
                  )}
                </Button>
              </Tooltip>
              <div className={classes.divider}></div>
            </>
          ) : (
            ""
          )}
          {group1.map((value, idx) => renderToolbarElement(idx, value))}
        </div>
        <div className={classes.group}>
          {group2.map((value, idx) => renderToolbarElement(idx, value))}
        </div>
      </MaterialToolbar>
    </ProseMirrorToolbarContext.Provider>
  );
};

export default withStyles(styles)(ProseMirrorToolbar);
