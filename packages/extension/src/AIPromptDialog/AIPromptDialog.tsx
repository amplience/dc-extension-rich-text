import {
  AIPromptDialogOptions,
  OpenAIMark
} from "@dc-extension-rich-text/common";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SvgIcon,
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
  props: AIPromptDialogProps & { onConfigure: () => void }
) => {
  const { variant = "generate", onSubmit, onConfigure } = props;
  const [prompt, setPrompt] = useState("");

  const strings = {
    generate: {
      title: "Generate Content",
      placeholder: "Write a blog post about...",
      button: "Generate"
    },
    rewrite: {
      title: "Rewrite Content",
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
      <DialogTitle style={{ paddingBottom: 0 }}>{strings.title}</DialogTitle>
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
                <IconButton onClick={onConfigure} size="small">
                  <SettingsIcon />
                </IconButton>
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
  const { configuration } = props;
  const [newOpenAIKey, setNewOpenAIKey] = useState(
    configuration.getUserDefinedKey()
  );
  const [newModel, setNewModel] = useState(configuration.getModel());
  const [isDirty, setIsDirty] = useState(false);
  const canAccessLocalStorage = configuration.canSaveUserDefinedConfigurations();

  const { onClose } = props;

  const handleUpdateOpenAIKey = (event: any) => {
    setNewOpenAIKey(event.target.value);
    setIsDirty(true);
  };

  const handleClearOpenAIKey = () => {
    setNewOpenAIKey("");
    setIsDirty(true);
  };

  const handleChangeModel = (event: any) => {
    setNewModel(event.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    configuration.setUserDefinedKey(newOpenAIKey);
    configuration.setUserDefinedModel(newModel);
    onClose();
  };

  return (
    <>
      <DialogTitle style={{ paddingBottom: 0 }}>
        Configure AI Assistant
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Our AI assistant, powered by ChatGPT, is designed to simplify and
          improve your content production and editing workflow. It offers a
          user-friendly interface to help generate and edit content using
          natural language.
          <br />
          <br />
          {canAccessLocalStorage ? (
            <>
              To get started, you'll need to create an OpenAI key. You can
              easily generate your key by visiting the following{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
              >
                page
              </a>
              . Once you have your key, simply enter it below to unlock the AI
              assistant feature.
            </>
          ) : (
            <>
              To find out how to enable the AI assistant, please visit the{" "}
              <a href="https://amplience.com/developers" target="_blank">
                getting started guide
              </a>
              .
            </>
          )}
        </Typography>

        {canAccessLocalStorage && (
          <>
            <div
              style={{
                marginTop: 10,
                marginBottom: 10,
                paddingTop: 2,
                paddingBottom: 2
              }}
            >
              <TextField
                onChange={handleUpdateOpenAIKey}
                value={Boolean(newOpenAIKey) ? newOpenAIKey : ""}
                placeholder="OpenAI API Key"
                type="password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon>
                        <OpenAIMark />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearOpenAIKey}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                fullWidth={true}
                variant="outlined"
              />
            </div>

            <Typography variant="body2">
              You can also choose which version of ChatGPT you wish to use
              below. You can learn more about the capabilities and pricing for
              each version{" "}
              <a
                href="https://platform.openai.com/docs/models/overview"
                target="_blank"
              >
                here
              </a>
              .
            </Typography>

            <FormControl fullWidth={true} style={{ marginTop: 12 }}>
              <InputLabel
                id="ai-model-label"
                style={{ marginLeft: 15, marginTop: -3 }}
              >
                Model
              </InputLabel>
              <Select
                labelId="ai-model-label"
                id="ai-model"
                variant="outlined"
                value={newModel}
                onChange={handleChangeModel}
              >
                <MenuItem value={"gpt-3.5-turbo"}>GPT-3.5</MenuItem>
                <MenuItem value={"gpt-4"}>GPT-4</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!isDirty} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </>
  );
};

const AIPromptDialog: React.SFC<AIPromptDialogProps> = (
  props: AIPromptDialogProps
) => {
  const { open, onClose } = props;
  const configuration = new AIConfiguration(props.params);

  const [view, setView] = useState(() => {
    return configuration.getKey() === undefined ? "configure" : "prompt";
  });

  const handleShowConfigureView = () => {
    setView("configure");
  };

  const handleCancelConfigure = React.useCallback(() => {
    if (configuration.getKey()) {
      setView("prompt");
    } else {
      onClose();
    }
  }, [configuration]);

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
          onConfigure={handleShowConfigureView}
        />
      )}
      {view === "configure" && (
        <ConfigureAIDialogContent
          {...props}
          configuration={configuration}
          onClose={handleCancelConfigure}
        />
      )}
    </Dialog>
  );
};

export default AIPromptDialog;
