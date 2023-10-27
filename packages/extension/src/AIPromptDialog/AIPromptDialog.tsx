import { AIPromptDialogOptions } from "@dc-extension-rich-text/common";
import {
  Button,
  createStyles,
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
import { Close } from "@material-ui/icons";
import clsx from "clsx";
import React, { useState } from "react";
import { AIConfiguration } from "./AIConfiguration";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";

const styles = createStyles({
  root: {},
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
  button: {
    marginLeft: "auto",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#1ab0f9",
      color: "#fff",
    },
  },
});

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
      <Close style={{ width: 24, height: 24 }}></Close>
    </IconButton>
  );
}

function DialogHeader(props: any) {
  const { onClose, title } = props;
  return (
    <DialogTitle style={{ paddingBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <SparklesIcon></SparklesIcon>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
          {title}
        </span>
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
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={handleSubmit}
                  variant="outlined"
                  color="primary"
                  className={classes.button}
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

const AIPromptDialog: React.SFC<AIPromptDialogProps> = (
  props: AIPromptDialogProps
) => {
  const { open, onClose, classes } = props;
  const configuration = new AIConfiguration(props.params);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      className={clsx(classes.root)}
    >
      <AIPromptDialogContent {...props} configuration={configuration} />
    </Dialog>
  );
};

export default withStyles(styles)(AIPromptDialog);
