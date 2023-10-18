import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import React from "react";

import { Anchor } from "@dc-extension-rich-text/common";

interface AnchorDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: Anchor) => void;
  value: {
    existing: Set<string>;
    value: any;
  };
}

const htmlIdRegex = /^[a-zA-Z][\w:.-]*$/;

function validateId(value: string, existing: Set<string>): string | undefined {
  if (value == null || value.length === 0) {
    return "ID cannot be empty.";
  }

  if (!htmlIdRegex.test(value)) {
    return "Invalid ID.";
  }

  if (existing.has(value)) {
    return "ID is already in use.";
  }

  return undefined;
}

const AnchorDialog: React.SFC<AnchorDialogProps> = (
  props: AnchorDialogProps
) => {
  const { open, onClose, onSubmit } = props;
  const existing = props.value ? props.value.existing : new Set<string>();

  const [value, setValue] = React.useState<Anchor>({
    value: "",
  });

  const [lastValue, setLastValue] = React.useState<Anchor>();

  if (
    props.value != null &&
    props.value.value != null &&
    lastValue !== props.value.value
  ) {
    setValue(props.value.value);
    setLastValue(props.value.value);
  }

  const validate = (checkValue: string) => validateId(checkValue, existing);

  const valid = validate(value.value);
  const [validError, setValidError] = React.useState<string | undefined>(valid);
  if (valid !== validError) {
    setValidError(valid);
  }

  const handleInputChanged = React.useCallback(
    (name: string, fieldValue: string) => {
      const newValue = {
        ...value,
        [name]: fieldValue,
      };

      setValue(newValue);
      const error = validate(newValue.value);
      setValidError(error);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, setValue, setValidError]
  );

  const reset = () => {
    setValue({
      value: "",
    });
  };

  const handleCancel = React.useCallback(() => {
    reset();
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, onClose]);

  const handleSubmit = React.useCallback(() => {
    reset();
    onSubmit(value);
  }, [value, onSubmit]);

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
            error={validError !== undefined}
            autoFocus={true}
            id="value"
            label="Anchor ID"
            type="input"
            required={true}
            fullWidth={true}
            value={value.value}
            onChange={(event) =>
              handleInputChanged("value", event.target.value)
            }
            helperText={validError}
          />
          <FormHelperText>Example: paragraph-4</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          disabled={validError !== undefined}
          onClick={handleSubmit}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnchorDialog;
