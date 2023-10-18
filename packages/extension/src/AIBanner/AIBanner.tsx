import React from "react";

function ErrorMessage({ showCreditsError }: { showCreditsError: boolean }) {
  if (showCreditsError) {
    return (
      <span>
        You're out of Amplience Credits. You can still use the editor to compose
        your own text. <a href="https://amplience.com">Get more credits</a>
      </span>
    );
  }

  return <></>;
}

export default function AIBanner({
  showCreditsError,
}: {
  showCreditsError: boolean;
}) {
  return (
    <div>
      <ErrorMessage showCreditsError={showCreditsError}></ErrorMessage>
    </div>
  );
}
