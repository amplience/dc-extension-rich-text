import { AIPromptDialogOptions } from "@dc-extension-rich-text/common";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Assistant as AssistantIcon, Close } from "@material-ui/icons";
import clsx from "clsx";
import React, { useState } from "react";
import { AIConfiguration } from "./AIConfiguration";
import AIPromptDialogGraphic from "./AIPromptDialogGraphic";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";

const styles = {
  root: {},
  prompt: {},
  configure: {
    "& .MuiDialogContent-root, & .MuiDialogTitle-root, & .MuiDialogActions-root": {
      backgroundColor: "#002C42",
      color: "white",
      paddingLeft: 30,
      paddingRight: 30,
    },
    "& .MuiDialog-paper": {
      height: 290,
      overflow: "hidden",
    },
    "& .MuiDialogActions-root": {
      justifyContent: "flex-start",
      paddingBottom: 30,
    },
    "& .MuiDialogTitle-root": {
      paddingTop: 30,
    },
  },
  configureContent: {
    maxWidth: "50%",
  },
  configureGraphic: {
    width: 550,
    position: "absolute" as "absolute",
    right: 0,
    top: -60,
  },
  getStartedAction: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: "5px 15px",
  },
  cancelAction: {
    color: "white",
  },
};

interface AIPromptDialogProps
  extends AIPromptDialogOptions,
    WithStyles<typeof styles> {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  params: any;
}

function CloseButton(props: any) {
  return (
    <IconButton
      aria-label="Close"
      {...props}
      style={{ marginLeft: "auto" }}
      disableFocusRipple={true}
      disableRipple={true}
    >
      <Close></Close>
    </IconButton>
  );
}

function DialogHeader(props: any) {
  const { onClose, title } = props;
  return (
    <DialogTitle style={{ paddingBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <SparklesIcon></SparklesIcon>
        <span style={{ fontSize: "16px", fontWeight: 500 }}>{title}</span>
        <CloseButton onClick={onClose}></CloseButton>
      </div>
    </DialogTitle>
  );
}

const AIPromptDialogContent: React.SFC<any> = (props: AIPromptDialogProps) => {
  const { variant = "generate", onSubmit, classes, onClose } = props;
  const [prompt, setPrompt] = useState("");

  const strings = {
    generate: {
      title: "What do you want to write about?",
      placeholder:
        "For the best results, be as specific and detailed as possible",
      button: "Generate",
    },
    rewrite: {
      title: "Tell us how to rewrite the text",
      placeholder:
        "For the best results, be as specific and detailed as possible",
      button: "Rewrite",
    },
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
      <DialogHeader
        classes={classes}
        onClose={onClose}
        title={strings.title}
      ></DialogHeader>
      <DialogContent>
        <TextField
          value={prompt}
          placeholder={strings.placeholder}
          onChange={handlePromptChange}
          onKeyUp={handleKeyUp}
          multiline
          rowsMax={9}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssistantIcon color="primary" fontSize="large" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disableElevation={true}
                  disabled={!prompt.length}
                >
                  {strings.button}
                </Button>
              </InputAdornment>
            ),
          }}
          fullWidth={true}
          variant="outlined"
        />
        <Typography variant="caption">
          <a
            href="https://amplience.com/developers/docs/knowledge-center/amplience-labs"
            target="_blank"
            style={{
              fontSize: "11px",
              textDecoration: "none",
              color: "#039be5",
            }}
          >
            Amplience Labs preview
          </a>
        </Typography>
      </DialogContent>
      <DialogActions />
    </>
  );
};

const ConfigureAIDialogContent: React.SFC<any> = (
  props: AIPromptDialogProps & { configuration: AIConfiguration }
) => {
  const { onClose, classes } = props;

  return (
    <>
      <DialogHeader
        classes={classes}
        onClose={onClose}
        title="What do you want to write about?"
      ></DialogHeader>

      <DialogContent>
        <Typography variant="body2" className={classes.configureContent}>
          Our AI assistant, powered by ChatGPT, is designed to simplify and
          improve your content production and editing workflow. It offers a
          user-friendly interface to help generate and edit content using
          natural language.
          <br />
          <br />
          Visit the link below to find out how to enable the AI assistant.
        </Typography>
        <AIPromptDialogGraphic className={classes.configureGraphic} />
      </DialogContent>
      <DialogActions>
        <TextField
          className={classes.getStartedAction}
          value={
            "https://github.com/amplience/dc-extension-rich-text#ai-assistant"
          }
        />
        <Button className={classes.cancelAction} onClick={onClose}>
          Not at the moment
        </Button>
      </DialogActions>
    </>
  );
};

const AIPromptDialog: React.SFC<AIPromptDialogProps> = (
  props: AIPromptDialogProps
) => {
  const { open, onClose, classes } = props;
  const configuration = new AIConfiguration(props.params);
  const view = configuration.getKey() ? "prompt" : "configure";

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      className={clsx(
        classes.root,
        {
          prompt: classes.prompt,
          configure: classes.configure,
        }[view]
      )}
    >
      {view === "prompt" && (
        <AIPromptDialogContent {...props} configuration={configuration} />
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

export default withStyles(styles)(AIPromptDialog);
