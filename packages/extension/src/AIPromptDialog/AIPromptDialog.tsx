import { AIPromptDialogOptions } from "@dc-extension-rich-text/common";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Assistant as AssistantIcon } from "@material-ui/icons";
import clsx from "clsx";
import React, { useState } from "react";
import { AIConfiguration } from "./AIConfiguration";

const styles = {
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
  betaBadge: {
    "& .MuiBadge-badge": {
      backgroundColor: "#f78a8b",
    },
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

const AIPromptDialogContent: React.SFC<any> = (props: AIPromptDialogProps) => {
  const { variant = "generate", onSubmit, classes } = props;
  const [prompt, setPrompt] = useState("");

  const strings = {
    generate: {
      placeholder: "Write a blog post about...",
      button: "Generate",
    },
    rewrite: {
      placeholder: "Rewrite this content in the style of...",
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
      <DialogTitle style={{ paddingBottom: 0 }}>
        AI Assistant
        <Badge
          style={{ marginLeft: "20px", lineHeight: "16px" }}
          badgeContent="BETA"
          color="error"
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          className={classes.betaBadge}
        >
          &nbsp;
        </Badge>
      </DialogTitle>
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
                <Button onClick={handleSubmit}>{strings.button}</Button>
              </InputAdornment>
            ),
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
