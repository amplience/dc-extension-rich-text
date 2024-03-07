import { AIPromptDialogOptions } from "@dc-extension-rich-text/common";
import {
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import pointer from "json-pointer";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { AIConfiguration } from "./AIConfiguration";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";
import { SdkContext } from "unofficial-dynamic-content-ui";
import { SDK } from "dc-extensions-sdk";

const styles = createStyles({
  root: {
    minWidth: 440,
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

async function getKeywords(sdk: SDK) {
  type Params = {
    language: string;
    sources: string[];
  };
  const params = {
    ...sdk.params.installation,
    ...sdk.params.instance,
  } as Params;
  const form = await sdk.form.getValue().catch(() => ({}));
  return params.sources.map((source) => {
    try {
      return pointer.get(form, source);
    } catch (e) {
      return "";
    }
  });
}

const AIPromptDialogContent: React.SFC<any> = (props: AIPromptDialogProps) => {
  const { sdk } = React.useContext(SdkContext);
  const { variant = "generate", onSubmit, classes, onClose } = props;
  const [prompt, setPrompt] = useState("");
  const [keywords, setKeywords] = useState([""]);

  useEffect(() => {
    getKeywords(sdk as SDK).then((data) => {
      setKeywords(data[0].split(", "));
    });
  }, []);

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
        <span>
          <Typography variant="caption">Optimize for SEO using:</Typography>
          {keywords.map((keyword) => {
            return <Chip label={keyword} />;
          })}
        </span>
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
          Powered by ChatGPT API.{" "}
          <Link
            underline="none"
            href="https://amplience.com/developers/docs/ai-services/generative-rich-text-editor"
            target="_blank"
          >
            Learn more
          </Link>
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
