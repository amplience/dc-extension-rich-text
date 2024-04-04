import { AIPromptDialogOptions } from "@dc-extension-rich-text/common";
import {
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Close, Check, Info } from "@material-ui/icons";
import pointer from "json-pointer";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { AIConfiguration } from "./AIConfiguration";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";
import { SdkContext } from "unofficial-dynamic-content-ui";
import { SDK } from "dc-extensions-sdk";
import { ReactComponent as InfoIcon } from "./info-icon.svg";

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
  keywordsContainer: {
    marginBottom: "12px",
  },
  chip: {
    color: "#fff",
    fontSize: 13,
    height: "24px",
  },
  keywordCheckIcon: {
    color: "#fff",
  },
  infoIcon: {
    height: "15px",
    width: "15px",
    transform: "translateY(25%)",
    marginLeft: "5px",
  },
  tooltip: {
    fontSize: 12,
    backgroundColor: "#1A222D",
  },
  arrow: {
    color: "#1A222D",
  },
});

interface AIPromptDialogProps
  extends AIPromptDialogOptions,
    WithStyles<typeof styles> {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: { prompt: string; keywords: string[] }) => void;
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
    keywordSource: string;
  };
  const params = {
    ...sdk.params.installation,
    ...sdk.params.instance,
  } as Params;
  const form = await sdk.form.getValue().catch(() => ({}));

  try {
    return pointer.get(form, params.keywordSource);
  } catch (e) {
    return "";
  }
}

function SeoKeywords(props: any) {
  const infoTooltipString =
    "Optimize your AI prompt by importing data from other fields such as SEO keywords, titles, and descriptions.";
  return (
    <Grid
      container
      className={props.classes.keywordsContainer}
      spacing={1}
      alignItems="center"
    >
      <Grid item>
        <Typography variant="caption">Optimize for SEO using:</Typography>
        <Tooltip
          title={infoTooltipString}
          arrow
          classes={{
            arrow: props.classes.arrow,
            tooltip: props.classes.tooltip,
          }}
        >
          <SvgIcon viewBox="0 0 15 15" className={props.classes.infoIcon}>
            <InfoIcon />
          </SvgIcon>
        </Tooltip>
      </Grid>

      <Grid item>
        <Tooltip
          title={props.keywords.join(", ")}
          arrow
          classes={{
            arrow: props.classes.arrow,
            tooltip: props.classes.tooltip,
          }}
        >
          <Chip
            icon={
              props.useKeywords ? (
                <Check
                  fontSize="small"
                  className={props.classes.keywordCheckIcon}
                />
              ) : (
                undefined
              )
            }
            label="SEO Keywords"
            color="primary"
            className={props.classes.chip}
            onClick={() => props.handleKeywordClick()}
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
}

const AIPromptDialogContent: React.SFC<any> = (props: AIPromptDialogProps) => {
  const { sdk } = React.useContext(SdkContext);
  const { variant = "generate", onSubmit, classes, onClose } = props;
  const [prompt, setPrompt] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [useKeywords, setUseKeywords] = useState<boolean>(true);

  useEffect(() => {
    getKeywords(sdk as SDK).then((keywords) => {
      if (keywords) {
        setKeywords(
          keywords.split(",").map((keyword: string) => keyword.trim())
        );
      }
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
    const submitPayload = { prompt, keywords: useKeywords ? keywords : [] };
    onSubmit(submitPayload);
  };

  const handleKeyUp = (event: any) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleKeywordClick = () => {
    setUseKeywords(!useKeywords);
  };

  return (
    <>
      <DialogHeader
        classes={classes}
        onClose={onClose}
        title={strings.title}
      ></DialogHeader>
      <DialogContent>
        {keywords.length ? (
          <SeoKeywords
            classes={classes}
            useKeywords={useKeywords}
            keywords={keywords}
            handleKeywordClick={handleKeywordClick}
          />
        ) : (
          undefined
        )}
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
