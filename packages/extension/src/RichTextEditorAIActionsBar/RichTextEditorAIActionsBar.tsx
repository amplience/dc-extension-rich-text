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
  const { params, actions } = useRichTextEditorContext();

  const editPrompts = params?.tools?.ai?.editPrompts || [
    {
      label: 'Improve this',
    prompt: 'Improve this'
    },
    {
      label: 'Shorten this',
      prompt: 'Shorten this'
    }
  ];

  const handleEditPrompt = async (prompt: any) => {
    await actions.rewriteSelectedContentUsingGenerativeAI(prompt.prompt);
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
      </Grid>
    </div>
  );
};

export default withStyles(styles)(RichTextEditorAIActionsBar);
