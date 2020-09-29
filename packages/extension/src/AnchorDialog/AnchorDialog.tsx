import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField
} from "@material-ui/core";
import React from "react";

import { Anchor } from "@dc-extension-rich-text/common";

interface AnchorDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: Anchor) => void;
  value: any;
}

const htmlIdRegex = /^[a-zA-Z][\w:.\-]*$/;

function validateId(value: string): boolean {
  return value != null && value.length > 0 && htmlIdRegex.test(value);
}

const AnchorDialog: React.SFC<AnchorDialogProps> = (
  props: AnchorDialogProps
) => {
  const { open, onClose, onSubmit } = props;

  const [value, setValue] = React.useState<Anchor>({
    value: ""
  });

  const [lastValue, setLastValue] = React.useState<Anchor>();

  if (props.value != null && lastValue !== props.value) {
    setValue(props.value);
    setLastValue(props.value);
  }

  const [isValid, setIsValid] = React.useState(false);

  const handleInputChanged = React.useCallback(
    (name: string, fieldValue: string) => {
      const newValue = {
        ...value,
        [name]: fieldValue
      };

      setValue(newValue);
      setIsValid(validateId(newValue.value));
    },
    [value, setValue, setIsValid]
  );

  const reset = () => {
    setValue({
      value: ""
    });
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
      <DialogTitle id="form-dialog-title">Anchor</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <TextField
            autoFocus={true}
            id="value"
            label="Anchor ID"
            type="input"
            required={true}
            fullWidth={true}
            value={value.value}
            onChange={event => handleInputChanged("value", event.target.value)}
          />
          <FormHelperText>
            Example: paragraph-4
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnchorDialog;
