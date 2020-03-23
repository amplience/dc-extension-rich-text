import { IconButton, withStyles, WithStyles } from "@material-ui/core";
import React, { PropsWithChildren } from "react";

import { ProseMirrorToolbarContext } from "../ProseMirrorToolbar";

import clsx from "clsx";

export interface ProseMirrorToolbarButtonProps
  extends PropsWithChildren<WithStyles<typeof styles>> {
  toolName: string;
}

const styles = {
  root: {
    margin: "1px"
  }
};

const ProseMirrorToolbarIconButton: React.SFC<ProseMirrorToolbarButtonProps> = (
  props: ProseMirrorToolbarButtonProps
) => {
  const { toolName, classes } = props;

  const { getToolState, applyTool } = React.useContext(
    ProseMirrorToolbarContext
  );

  const toolState = getToolState ? getToolState(toolName) : null;
  const handleClick = React.useCallback(event => {
    const focus = document.activeElement;
    if (applyTool) {
      applyTool(toolName);
    }

    // Focus will switch to the button, which is required to play the ripple effect.
    // If we return it to the original element as soon as possible, the cursor will be in the same spot.
    if (focus != null) {
      setTimeout(() => (focus as HTMLElement).focus(), 0);
    }
  }, [toolName, applyTool]);

  if (!toolState || !toolState.visible) {
    return null;
  }

  return (
    <IconButton
      className={clsx(classes.root)}
      onMouseDown={handleClick}
      size="small"
      disabled={!toolState.enabled}
      color={toolState.active ? "primary" : "default"}
      title={toolState.label}
    >
      {toolState.displayIcon ? toolState.displayIcon : toolState.label}
    </IconButton>
  );
};

export default withStyles(styles)(ProseMirrorToolbarIconButton);
