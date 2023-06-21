import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import AssistantIcon from '@material-ui/icons/Assistant';
import { GenerateContentPrompt } from "@dc-extension-rich-text/common";

interface GenerateContentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: GenerateContentPrompt) => void;
  params: any;
}

const GenerateContentDialog: React.SFC<GenerateContentDialogProps> = (
  props: GenerateContentDialogProps
) => {
  const {open, onClose, onSubmit} = props;
  const [prompt, setPrompt] = useState('');

  const handleCancel = React.useCallback(() => {
    onClose();
  }, [onSubmit]);

  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  }

  const handleSubmit = async () => {
    onSubmit({
      prompt
    })
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle style={{paddingBottom: 0}}>Generate Content</DialogTitle>
      <DialogContent>
        <TextField
            placeholder="Write a blog post about..."
            value={prompt}
            onChange={handlePromptChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssistantIcon color="primary" fontSize="large" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleSubmit}>Generate</Button>
                </InputAdornment>
              )
            }}
            fullWidth
            variant="outlined"
          />
        <Typography variant="caption">
          Powered by ChatGPT API
        </Typography>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateContentDialog;
