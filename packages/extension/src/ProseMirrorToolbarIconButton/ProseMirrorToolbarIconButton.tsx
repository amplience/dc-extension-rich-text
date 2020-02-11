import { IconButton } from "@material-ui/core";
import React from "react";

import { ProseMirrorToolbarContext } from "../ProseMirrorToolbar";

export interface ProseMirrorToolbarButtonProps {
  toolName: string;
}

const ProseMirrorToolbarIconButton: React.SFC<ProseMirrorToolbarButtonProps> = (
  props: ProseMirrorToolbarButtonProps
) => {
  const { toolName } = props;

  const { getToolState, applyTool } = React.useContext(
    ProseMirrorToolbarContext
  );

  const toolState = getToolState ? getToolState(toolName) : null;

  const handleClick = React.useCallback(() => {
    if (applyTool) {
      applyTool(toolName);
    }
  }, [toolName, applyTool]);

  if (!toolState) {
    return null;
  }

  return (
    <IconButton
      onClick={handleClick}
      size="small"
      disabled={!toolState.enabled}
      color={toolState.active ? "primary" : "default"}
      title={toolState.label}
    >
      {toolState.displayIcon ? toolState.displayIcon : toolState.label}
    </IconButton>
  );
};

export default ProseMirrorToolbarIconButton;
