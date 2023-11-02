import React from "react";

export default function CreditsError(props: any) {
  const { showCreditsError } = props;

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
