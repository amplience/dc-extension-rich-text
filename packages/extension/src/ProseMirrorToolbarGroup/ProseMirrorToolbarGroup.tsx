import { WithStyles, withStyles } from "@material-ui/core";
import React, { PropsWithChildren } from "react";

import clsx from "clsx";

const styles = {
  root: {
    display: "flex",
    alignItems: "center"
  },
  divider: {
    verticalAlign: "top",
    display: "inline-flex",
    height: 13,
    lineHeight: 13,
    borderRight: "1px solid rgb(218, 220, 224)",
    margin: "9px 4px"
  },
  empty: {
    display: "none"
  }
};

export interface ProseMirrorToolbarGroupProps
  extends PropsWithChildren<WithStyles<typeof styles>> {}

const ProseMirrorToolbarGroup: React.SFC<ProseMirrorToolbarGroupProps> = (
  props: ProseMirrorToolbarGroupProps
) => {
  const { children, classes } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.empty]: !children
      })}
    >
      {children}
      <div className={classes.divider} />
    </div>
  );
};

export default withStyles(styles)(ProseMirrorToolbarGroup);
