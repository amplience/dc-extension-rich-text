import React, { useContext } from "react";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";
import { Loader } from "../Loader/Loader";
import { Button, Link, createStyles, withStyles } from "@material-ui/core";
import RichtextEditorContext from "../RichTextEditor/RichTextEditorContext";

function ErrorMessage({ showCreditsError }: { showCreditsError: boolean }) {
  if (showCreditsError) {
    return (
      <p
        style={{
          fontSize: "11px",
          color: "#FF3366",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        You're out of Amplience credits. You can still use the Editor to compose
        text yourself.{" "}
        <a
          href="https://amplience.com/developers/docs/ai-services/credits"
          style={{ color: "#039BE5", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Top up your credits
        </a>
      </p>
    );
  }

  return <></>;
}

const styles = createStyles({
  button: {
    marginLeft: "auto",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#1ab0f9",
      color: "#fff",
    },
  },
});

function AIBanner(props: any) {
  const { showCreditsError, loading, classes } = props;
  const { dialogs, actions } = useContext(RichtextEditorContext);

  const showDialog = async () => {
    try {
      const prompt = await dialogs.getAIPrompt({
        variant: "generate",
      });
      await actions.insertAIContent(prompt);
    } catch {}
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginTop: "8px",
      }}
    >
      <SparklesIcon readOnly={showCreditsError ? true : false}></SparklesIcon>
      <div>
        <h1
          style={{
            fontSize: "13px",
            fontWeight: 400,
            color: showCreditsError ? "#BFBFBF" : "#333",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          Generative Rich Text Editor
        </h1>
        {showCreditsError ? (
          <ErrorMessage showCreditsError={showCreditsError}></ErrorMessage>
        ) : (
          <p
            style={{
              fontSize: "11px",
              color: "#666",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            Tell the AI Assistant what content to generate. Powered by ChatGPT
            API.{" "}
            <Link
              underline="none"
              href="http://amplience.com/docs/ai-services"
              target="_blank"
            >
              Learn more
            </Link>
          </p>
        )}
      </div>
      {loading ? (
        <div style={{ marginLeft: "auto" }}>
          <Loader></Loader>
        </div>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={showDialog}
          disabled={showCreditsError ? true : false}
        >
          Show prompt
        </Button>
      )}
    </div>
  );
}

export default withStyles(styles)(AIBanner);
