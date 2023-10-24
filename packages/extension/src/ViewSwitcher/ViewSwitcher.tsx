import { WithStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const styles = {
  root: {
    display: "flex",
  },
  button: {
    outline: "none" as "none",
    transition: "color 0.2s linear,border-bottom-color 0.2s linear",
    height: 42,
    cursor: "pointer" as "pointer",
    background: "transparent" as "transparent",
    border: "0 solid transparent",
    borderTop: "3px solid transparent",
    borderBottom: "3px solid transparent",
    fontSize: 11,
    padding: "0 15px",
    color: "#333",
    fontWeight: "bold" as "bold",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  selected: {
    color: "#1EA7FD",
    borderBottomColor: "#1EA7FD",
  },
};

export interface ViewSwitcherProps extends WithStyles<typeof styles> {
  disableCodeView?: boolean;
  disableEditView?: boolean;

  language?: string;
  onChange?: (view: EditorView) => void;
}

export enum EditorView {
  EDIT = "edit",
  CODE = "code",
}

const ViewSwitcher = (props: ViewSwitcherProps) => {
  const {
    classes,
    onChange,
    language,
    disableCodeView,
    disableEditView,
  } = props;

  const [selectedView, setSelectedView] = React.useState(
    !disableEditView ? EditorView.EDIT : EditorView.CODE
  );

  const handleChange = React.useCallback(
    (view: EditorView) => {
      setSelectedView(view);
      if (onChange) {
        onChange(view);
      }
    },
    [setSelectedView]
  );

  const renderButton = React.useCallback(
    (label: string, view: EditorView) => {
      return (
        <button
          onClick={() => handleChange(view)}
          className={clsx(classes.button, {
            [classes.selected]: selectedView === view,
          })}
          type="button"
          role="tab"
        >
          {label}
        </button>
      );
    },
    [selectedView, handleChange]
  );

  return (
    <div className={classes.root}>
      {disableEditView ? false : renderButton("Editor", EditorView.EDIT)}
      {disableCodeView
        ? false
        : renderButton(language || "Code", EditorView.CODE)}
    </div>
  );
};

export default withStyles(styles)(ViewSwitcher);
