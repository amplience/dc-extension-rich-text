import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField
} from "@material-ui/core";
import React from "react";

interface CodeDialogProps {
  value?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const htmlIdRegex = /^[a-zA-Z]?[\w:.\-\/]*$/;

const validate = (checkValue: string) =>
  !htmlIdRegex.test(checkValue) ? "Value contains invalid characters" : "";

const CodeDialog: React.SFC<CodeDialogProps> = (props: CodeDialogProps) => {
  const { open, onClose, onSubmit } = props;

  const [value, setValue] = React.useState<string>("");

  const [validError, setValidError] = React.useState<string>("");

  const [lastValue, setLastValue] = React.useState<string>();

  if (lastValue !== props.value) {
    setValue(props.value || "");
    setLastValue(props.value);
  }

  const handleInputChanged = React.useCallback(
    val => {
      setValue(val || "");

      const error = validate(val);
      setValidError(error);
    },
    [value, setValue, setValidError]
  );

  const reset = () => {
    setValue("");
  };

  const handleCancel = React.useCallback(() => {
    reset();
    onClose();
  }, [setValue, onClose]);

  const handleSubmit = React.useCallback(() => {
    reset();
    onSubmit(value);
  }, [value, setValue, onSubmit]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Code block</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <TextField
            error={!!validError}
            helperText={validError}
            autoFocus={true}
            id="href"
            label="Language"
            type="input"
            fullWidth={true}
            value={value}
            onChange={event => handleInputChanged(event.target.value || "")}
          />
          <FormHelperText>
            The language to use for syntax highlighting, e.g. javascript or html
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button disabled={!!validError} onClick={handleSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodeDialog;
