import React, { useContext } from "react";
import { SparklesIcon } from "../SparklesIcon/SparklesIcon";
import { Loader } from "../Loader/Loader";
import { Button, Link } from "@material-ui/core";
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
        You're out of Amplience Credits. You can still use the editor to compose
        your own text.{" "}
        <a
          href="https://amplience.com"
          style={{ color: "#039BE5", textDecoration: "none" }}
        >
          Get more credits
        </a>
      </p>
    );
  }

  return <></>;
}

export default function AIBanner({
  showCreditsError,
  loading,
}: {
  showCreditsError: boolean;
  loading: boolean;
}) {
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
      <SparklesIcon></SparklesIcon>
      <div>
        <h1
          style={{
            fontSize: "13px",
            fontWeight: 400,
            color: "#333",
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          Generative Rich Text Editor
        </h1>
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
        <ErrorMessage showCreditsError={showCreditsError}></ErrorMessage>
      </div>
      {loading ? (
        <div style={{ marginLeft: "auto" }}>
          <Loader></Loader>
        </div>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          style={{ marginLeft: "auto" }}
          onClick={showDialog}
        >
          Show prompt
        </Button>
      )}
    </div>
  );
}
