import React from "react";

import {
  Chip,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { Grid } from '@material-ui/core';

import { useRichTextEditorContext } from "../RichTextEditor/RichTextEditorContext";
import AssistantIcon from '@material-ui/icons/Assistant';

const styles = {
  root: {
    borderTop: "1px solid rgb(218, 220, 224)",
    position: 'absolute' as 'absolute',
    background: 'white',
    paddingTop: '8px',
    width: '100%',
    bottom: 0
  }
};

export interface RichTextEditorAIActionsBarProps extends WithStyles<typeof styles> {
}

const RichTextEditorAIActionsBar: React.SFC<RichTextEditorAIActionsBarProps> = (
  props: RichTextEditorAIActionsBarProps
) => {
  const { classes } = props;
  const { params, actions, dialogs, proseMirrorEditorView } = useRichTextEditorContext();

  const editPrompts = params?.tools?.ai?.editPrompts || [
    {
      label: 'Improve this',
    prompt: 'Improve this'
    },
    {
      label: 'Shorten this',
      prompt: 'Shorten this'
    },
    {
      label: 'Elaborate on this',
      prompt: 'Elaborate on this'
    },
    {
      label: 'Shakespeareify this',
      prompt: 'Rewrite this in the style of shakespeare'
    },
    {
      label: 'leetspeak this',
      prompt: 'Rewrite this in leetspeak'
    }
  ];

  const handleEditPrompt = async (prompt: any) => {
    const from = proseMirrorEditorView?.state.selection.from;
    const to = proseMirrorEditorView?.state.selection.to;
    await actions.rewriteSelectedContentUsingGenerativeAI(from, to, prompt.prompt);
  };


  const handleCustomAiRewrite = async () => {
    const from = proseMirrorEditorView?.state.selection.from;
    const to = proseMirrorEditorView?.state.selection.to;
    const prompt = await dialogs.customAiRewrite();
    await actions.rewriteSelectedContentUsingGenerativeAI(from, to, prompt.prompt);
  };


  return (
    <div className={classes.root}>
      <Grid direction="row" spacing={1} container>
        {
          editPrompts.map((prompt: any) => {
            return <Grid item>
              <Chip icon={<AssistantIcon color="primary"/>} label={prompt.label} variant='outlined' onClick={() => handleEditPrompt(prompt)} />
            </Grid>;
          })
        }
        <Grid item>
              <Chip icon={<AssistantIcon color="primary"/>} label='Custom...' variant='outlined' onClick={() => handleCustomAiRewrite()} />
            </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(RichTextEditorAIActionsBar);
