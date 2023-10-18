import React, { ChangeEvent } from "react";

import { ProseMirrorToolState } from "@dc-extension-rich-text/common";
import { MenuItem, Select, WithStyles, withStyles } from "@material-ui/core";
import { ProseMirrorToolbarContext } from "../ProseMirrorToolbar";

const styles = {
  value: {
    fontSize: 14,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "unset" as "unset",
  },
};

export interface ProseMirrorToolbarButtonProps
  extends WithStyles<typeof styles> {
  toolNames: string[];
  label?: string;
  isLocked?: boolean;
}

const ProseMirrorToolbarDropdown: React.SFC<ProseMirrorToolbarButtonProps> = (
  props: ProseMirrorToolbarButtonProps
) => {
  const { toolNames, classes, label } = props;

  const { getToolState, applyTool } = React.useContext(
    ProseMirrorToolbarContext
  );

  const toolStates = toolNames
    .map((toolName) => {
      const toolState = getToolState ? getToolState(toolName) : null;
      return toolState;
    })
    .filter((x) => x != null) as ProseMirrorToolState[];

  const selectedItems: ProseMirrorToolState[] = toolStates.filter(
    (x) => x.active
  );

  const selected =
    selectedItems && selectedItems.length > 1
      ? selectedItems.find((x) => /inline_styles/.test(x.name)) ||
        selectedItems[0]
      : selectedItems.find((x) => x.active);

  const value = selected ? selected.name : "";

  const handleChange = React.useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (applyTool) {
        applyTool(event.target.value as string);
      }
    },
    [applyTool]
  );

  // override renderValue so menu items can be styled
  const renderValue = React.useCallback(
    (toolName?: any) => {
      if (!toolName) {
        return label || "";
      }

      let toolState:
        | { label: string; displayLabel?: React.ReactElement }
        | undefined = getToolState ? getToolState(toolName) : undefined;

      if (!toolState) {
        toolState = { label: toolName };
      }

      if (toolState.displayLabel) {
        return React.cloneElement(toolState.displayLabel, {
          className: classes.value,
        });
      }
      return toolState.label;
    },
    [classes.value, getToolState, label]
  );

  if (toolStates.length === 0) {
    return null;
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      renderValue={renderValue}
      displayEmpty={true}
      onMouseDown={(e) => e.preventDefault()}
      disabled={props.isLocked}
    >
      {toolStates.map((toolState) => {
        return (
          <MenuItem
            value={toolState.name}
            key={toolState.name}
            onMouseDown={(e) => e.preventDefault()}
          >
            {toolState.displayLabel ? (
              toolState.displayLabel
            ) : (
              <span>{toolState.label}</span>
            )}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default withStyles(styles)(ProseMirrorToolbarDropdown);
