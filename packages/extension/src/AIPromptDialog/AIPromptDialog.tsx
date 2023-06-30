import {
  AIPromptDialogOptions
} from "@dc-extension-rich-text/common";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography
} from "@material-ui/core";
import {
  Assistant as AssistantIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";
import React, { useState } from "react";
import { AIConfiguration } from "./AIConfiguration";

interface AIPromptDialogProps extends AIPromptDialogOptions {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  params: any;
}

const AIPromptDialogContent: React.SFC<any> = (
  props: AIPromptDialogProps
) => {
  const { variant = "generate", onSubmit } = props;
  const [prompt, setPrompt] = useState("");

  const strings = {
    generate: {
      placeholder: "Write a blog post about...",
      button: "Generate"
    },
    rewrite: {
      placeholder: "Rewrite this content in the style of...",
      button: "Rewrite"
    }
  }[variant];

  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    onSubmit(prompt);
  };

  const handleKeyUp = (event: any) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <DialogTitle style={{ paddingBottom: 0 }}>
        AI Assistant
        <Badge style={{marginLeft: '20px', lineHeight: '16px'}} badgeContent='BETA' color="error" anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
          &nbsp;
        </Badge>
      </DialogTitle>
      <DialogContent>
        <TextField
          value={prompt}
          placeholder={strings.placeholder}
          onChange={handlePromptChange}
          onKeyUp={handleKeyUp}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssistantIcon color="primary" fontSize="large" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={handleSubmit}>{strings.button}</Button>
              </InputAdornment>
            )
          }}
          fullWidth={true}
          variant="outlined"
        />
        <Typography variant="caption">Powered by ChatGPT API</Typography>
      </DialogContent>
      <DialogActions />
    </>
  );
};

const ConfigureAIDialogContent: React.SFC<any> = (
  props: AIPromptDialogProps & { configuration: AIConfiguration }
) => {
  const { onClose } = props;

  return (
    <>
      <DialogTitle style={{ paddingBottom: 0 }}>
          AI Assistant
          <Badge style={{marginLeft: '20px', lineHeight: '16px'}} badgeContent='BETA' color="error" anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
            &nbsp;
          </Badge>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Our AI assistant, powered by ChatGPT, is designed to simplify and
          improve your content production and editing workflow. It offers a
          user-friendly interface to help generate and edit content using
          natural language.
          <br />
          <br />
          
          To find out how to enable the AI assistant, please visit the{" "}
          <a href="https://amplience.com/developers" target="_blank">
            getting started guide
          </a>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </>
  );
};

const AIPromptDialog: React.SFC<AIPromptDialogProps> = (
  props: AIPromptDialogProps
) => {
  const { open, onClose } = props;
  const configuration = new AIConfiguration(props.params);
  const view = configuration.getKey() ? 'prompt' : 'configure';

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      {view === "prompt" && (
        <AIPromptDialogContent
          {...props}
          configuration={configuration}
        />
      )}
      {view === "configure" && (
        <ConfigureAIDialogContent
          {...props}
          configuration={configuration}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

export default AIPromptDialog;
