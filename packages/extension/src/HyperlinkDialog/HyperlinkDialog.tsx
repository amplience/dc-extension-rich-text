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

import { Hyperlink } from "@dc-extension-rich-text/common";

interface HyperlinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: Hyperlink) => void;
}

function validateUrl(value: string): boolean {
  return value != null && value.length > 0;
}

const HyperlinkDialog: React.SFC<HyperlinkDialogProps> = (
  props: HyperlinkDialogProps
) => {
  const { open, onClose, onSubmit } = props;

  const [value, setValue] = React.useState<Hyperlink>({
    href: "",
    title: ""
  });

  const [isValid, setIsValid] = React.useState(false);

  const handleInputChanged = React.useCallback(
    (name: string, fieldValue: string) => {
      const newValue = {
        ...value,
        [name]: fieldValue
      };

      setValue(newValue);
      setIsValid(validateUrl(newValue.href));
    },
    [value, setValue, setIsValid]
  );

  const reset = () => {
    setValue({
      href: "",
      title: ""
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
      <DialogTitle id="form-dialog-title">Hyperlink</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <TextField
            autoFocus={true}
            id="href"
            label="Web Address"
            type="input"
            required={true}
            fullWidth={true}
            value={value.href}
            onChange={event => handleInputChanged("href", event.target.value)}
          />
          <FormHelperText>
            Example: https://www.storefront.com/black-friday
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth={true}>
          <TextField
            id="title"
            label="Title"
            type="input"
            fullWidth={true}
            value={value.title}
            onChange={event => handleInputChanged("title", event.target.value)}
          />
          <FormHelperText>Example: Black Friday Sale</FormHelperText>
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

export default HyperlinkDialog;
