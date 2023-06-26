import React from "react";

import { Chip, Grid, Theme, WithStyles, withStyles } from "@material-ui/core";

import { isToolEnabled } from "@dc-extension-rich-text/common";
import { Assistant as AssistantIcon } from "@material-ui/icons";
import { AIConfiguration } from "../AIPromptDialog";
import { useRichTextEditorContext } from "../RichTextEditor/RichTextEditorContext";

const styles = (theme: Theme) => ({
  root: {
    borderTop: "1px solid rgb(218, 220, 224)",
    position: "absolute" as "absolute",
    background: "white",
    paddingTop: "10px",
    width: "100%",
    bottom: 0
  },
  chip: {
    background: theme.palette.background.paper,
    "& .MuiChip-icon": {
      color: theme.palette.primary.main
    }
  }
});

export interface RichTextEditorAIActionsBarProps
  extends WithStyles<typeof styles> {}

const RichTextEditorAIActionsBar: React.SFC<RichTextEditorAIActionsBarProps> = (
  props: RichTextEditorAIActionsBarProps
) => {
  const { classes } = props;
  const {
    params,
    actions,
    dialogs,
    proseMirrorEditorView
  } = useRichTextEditorContext();

  const configuration = new AIConfiguration(params);
  const isAiToolEnabled = isToolEnabled("ai", params);
  const hasKey = Boolean(configuration.getKey());
  const editPrompts = configuration.getEditPrompts();

  const handleEditPrompt = async (prompt: any) => {
    await actions.rewriteSelectedContentUsingAI(prompt.prompt);
  };

  const handleCustomAiRewrite = async () => {
    const prompt = await dialogs.getAIPrompt({ variant: "rewrite" });
    await actions.rewriteSelectedContentUsingAI(prompt);
  };

  return isAiToolEnabled && hasKey ? (
    <div
      className={classes.root}
      style={{
        display: proseMirrorEditorView?.state.selection.empty ? "none" : "block"
      }}
    >
      <Grid direction="row" spacing={1} container={true}>
        {editPrompts.map((prompt: any) => {
          return (
            <Grid key={prompt.label} item={true}>
              <Chip
                className={classes.chip}
                icon={<AssistantIcon color="primary" />}
                label={prompt.label}
                variant="outlined"
                onClick={() => handleEditPrompt(prompt)}
              />
            </Grid>
          );
        })}
        <Grid item={true}>
          <Chip
            className={classes.chip}
            icon={<AssistantIcon color="primary" />}
            label="Custom..."
            variant="outlined"
            onClick={() => handleCustomAiRewrite()}
          />
        </Grid>
      </Grid>
    </div>
  ) : (
    <></>
  );
};

export default withStyles(styles)(RichTextEditorAIActionsBar);
