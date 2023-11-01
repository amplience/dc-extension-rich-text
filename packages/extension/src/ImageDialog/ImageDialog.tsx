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

import { Image } from "@dc-extension-rich-text/common";

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: Image) => void;
}

function validateUrl(value: string): boolean {
  return value != null && value.length > 0;
}

const ImageDialog: React.SFC<ImageDialogProps> = (props: ImageDialogProps) => {
  const { open, onClose, onSubmit } = props;

  const [value, setValue] = React.useState<Image>({
    src: "",
    alt: "",
    title: "",
  });

  const [isValid, setIsValid] = React.useState(false);

  const handleInputChanged = React.useCallback(
    (name: string, fieldValue: string) => {
      const newValue = {
        ...value,
        [name]: fieldValue,
      };

      setValue(newValue);
      setIsValid(validateUrl(newValue.src));
    },
    [value, setValue, setIsValid]
  );

  const reset = () => {
    setValue({
      src: "",
      alt: "",
      title: "",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, setValue, onSubmit]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Insert Image from URL</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <TextField
            autoFocus={true}
            id="src"
            label="Image Address"
            type="input"
            required={true}
            fullWidth={true}
            value={value.src}
            onChange={(event) => handleInputChanged("src", event.target.value)}
          />
          <FormHelperText>
            Example: https://cdn.storefront.com/image.jpg
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth={true}>
          <TextField
            id="title"
            label="Image Title"
            type="input"
            fullWidth={true}
            value={value.title}
            onChange={(event) =>
              handleInputChanged("title", event.target.value)
            }
          />
          <FormHelperText>Example: Black Friday Sale</FormHelperText>
        </FormControl>

        <FormControl fullWidth={true}>
          <TextField
            id="alt"
            label="Image Alternative Text"
            type="input"
            fullWidth={true}
            value={value.alt}
            onChange={(event) => handleInputChanged("alt", event.target.value)}
          />
          <FormHelperText>Example: Black Friday Sale</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSubmit} color="primary">
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
