import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography
} from "@material-ui/core";
import React, { useState } from "react";
import AssistantIcon from '@material-ui/icons/Assistant';
import { CustomAiRewrite } from "@dc-extension-rich-text/common";

interface CustomAiRewriteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: CustomAiRewrite) => void;
  params: any;
}

const CustomAiRewriteDialog: React.SFC<CustomAiRewriteDialogProps> = (
  props: CustomAiRewriteDialogProps
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
      <DialogTitle style={{paddingBottom: 0}}>Rewrite content</DialogTitle>
      <DialogContent>
        <TextField
            placeholder="Rewrite this content in the style of..."
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
                  <Button onClick={handleSubmit}>Rewrite</Button>
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

export default CustomAiRewriteDialog;