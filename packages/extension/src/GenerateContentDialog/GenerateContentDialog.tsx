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
import { GeneratedContent } from "@dc-extension-rich-text/common";

interface GenerateContentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: GeneratedContent) => void;
  params: any;
}

const GenerateContentDialog: React.SFC<GenerateContentDialogProps> = (
  props: GenerateContentDialogProps
) => {
  const { open, onClose, onSubmit } = props;

  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [prompt, setPrompt] = useState('');

  const handleCancel = React.useCallback(() => {
    onClose();
  }, [onSubmit]);

  const handleSubmit = React.useCallback(() => {
    // onSubmit(value);
  }, [onSubmit]);

  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  }

  const handleGenerate = () => {

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
                  <Button onClick={handleGenerate}>Generate</Button>
                </InputAdornment>
              )
            }}
            fullWidth
            variant="outlined"
          />

        {/* <TextField placeholder="Write a blog post about..." fullWidth /> */}
        {/* <FormControl>
          <InputLabel>Generate</InputLabel>
          <Select
            autoWidth={true}
            onChange={(handleChangePrompt)}
            defaultValue={selectedPrompt}
          >
            {prompts.map(({label}, index: number) => (
              <MenuItem key={index} value={index}>
                {`${label}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* {
          prompts[selectedPrompt].tokens.map((token: string) => {
            return <FormControl fullWidth>
              <TextField style={{marginTop: 10}} label={token} multiline fullWidth variant="outlined" rows={5} />
            </FormControl>
          })
        } */}
        <Typography variant="caption">
          Powered by ChatGPT API
        </Typography>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Generate
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default GenerateContentDialog;
