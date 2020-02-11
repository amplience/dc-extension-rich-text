import { WithStyles, withStyles } from "@material-ui/core";
import React, { ChangeEvent } from "react";

const styles = {
  root: {
    flex: 1,
    display: "flex",
    minHeight: 286,
    maxHeight: 500
  },
  textarea: {
    flex: 1,
    outline: "none" as "none",
    resize: "none" as "none",
    backgroundColor: "#f0f0f0",
    border: "1px solid rgba(157,162,162,.3)",
    padding: "10px 8px 0",
    fontFamily: "roboto,sans-serif!important",
    fontSize: 13
  }
};

export interface CodeTextAreaProps extends WithStyles<typeof styles> {
  readOnly?: boolean;
  value: string;
  onChange?: (value: string) => void;
}

const CodeTextArea: React.SFC<CodeTextAreaProps> = (
  props: CodeTextAreaProps
) => {
  const { classes, value, onChange, readOnly = false } = props;

  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }
    },
    [onChange]
  );

  return (
    <div className={classes.root}>
      <textarea
        readOnly={readOnly}
        className={classes.textarea}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default withStyles(styles)(CodeTextArea);
