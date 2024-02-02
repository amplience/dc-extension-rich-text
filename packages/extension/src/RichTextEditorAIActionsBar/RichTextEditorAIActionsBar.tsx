import React from "react";

import { Chip, Grid, Theme, WithStyles, withStyles } from "@material-ui/core";

import { isToolEnabled } from "@dc-extension-rich-text/common";
import { AIConfiguration } from "../AIPromptDialog";
import { useRichTextEditorContext } from "../RichTextEditor/RichTextEditorContext";

const styles = (theme: Theme) => ({
  root: {
    borderTop: "1px solid rgb(218, 220, 224)",
    position: "relative" as "relative",
    background: "white",
    paddingTop: "10px",
    width: "100%",
    bottom: 0,
  },
  chip: {
    color: "#039be5",
    border: "1px solid rgba(3, 155, 229, 0.5)",
    borderRadius: "3px",
    fontSize: "13px",
    padding: "0 5px",
    height: "30px",
    "&:hover": {
      border: "1px solid rgba(3, 155, 229, 1)",
      backgroundColor: "#fff !important",
    },
    "&:focus": {
      backgroundColor: "#fff !important",
    },
  },
});

export interface RichTextEditorAIActionsBarProps
  extends WithStyles<typeof styles> {
  showCreditsError: any;
}

const RichTextEditorAIActionsBar: React.SFC<RichTextEditorAIActionsBarProps> = (
  props: RichTextEditorAIActionsBarProps
) => {
  const { classes, showCreditsError } = props;
  const {
    params,
    actions,
    dialogs,
    proseMirrorEditorView,
  } = useRichTextEditorContext();

  const configuration = new AIConfiguration(params);
  const isAiToolEnabled =
    (params?.tools as { ai: { disabled: boolean } })?.ai?.disabled !== true;
  const editPrompts = configuration.getEditPrompts();

  const handleEditPrompt = async (prompt: any) => {
    await actions.rewriteSelectedContentUsingAI(prompt.prompt);
  };

  const handleCustomAiRewrite = async () => {
    const prompt = await dialogs.getAIPrompt({ variant: "rewrite" });
    await actions.rewriteSelectedContentUsingAI(prompt);
  };

  return isAiToolEnabled ? (
    <div className={classes.root}>
      <Grid direction="row" spacing={1} container={true} style={{ gap: 12 }}>
        {editPrompts.map((prompt: any) => {
          return (
            <Grid key={prompt.label} item={true}>
              <Chip
                className={classes.chip}
                label={prompt.label}
                variant="outlined"
                onClick={() => handleEditPrompt(prompt)}
                disabled={showCreditsError}
                style={{
                  visibility: proseMirrorEditorView?.state.selection.empty
                    ? "hidden"
                    : "visible",
                }}
              />
            </Grid>
          );
        })}
        <Grid item={true}>
          <Chip
            className={classes.chip}
            label="Custom rewrite"
            variant="outlined"
            onClick={() => handleCustomAiRewrite()}
            disabled={showCreditsError}
            style={{
              visibility: proseMirrorEditorView?.state.selection.empty
                ? "hidden"
                : "visible",
            }}
          />
        </Grid>
      </Grid>
    </div>
  ) : (
    <></>
  );
};

export default withStyles(styles)(RichTextEditorAIActionsBar);
