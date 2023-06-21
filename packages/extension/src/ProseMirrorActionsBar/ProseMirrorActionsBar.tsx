import React from "react";

import {
  WithStyles,
  withStyles
} from "@material-ui/core";

const styles = {
  root: {
  }
};

export interface ProseMirrorActionsBarProps extends WithStyles<typeof styles> {
}

const ProseMirrorActionsBar: React.SFC<ProseMirrorActionsBarProps> = (
  props: ProseMirrorActionsBarProps
) => {
  const { classes } = props;

  return (
    <div>
      hello world
    </div>
  );
};

export default withStyles(styles)(ProseMirrorActionsBar);
