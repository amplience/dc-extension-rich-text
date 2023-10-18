import React, { useContext, useEffect, useState } from "react";

function ErrorMessage() {
  // const [visible, setVisible] = useState(false);
  // useEffect(() => {
  //   console.log("am I called????");
  //   // @ts-ignore
  //   setVisible(creditsError?.visible);
  // }, [creditsError]);
  const visible = false;

  if (visible) {
    return (
      <span>
        You're out of Amplience Credits. You can still use the eidtor to compose
        your own text. <a href="https://amplience.com">Get more credits</a>
      </span>
    );
  }
  console.log("am I viisble?", visible);
  return <></>;
}

export default function AIBanner() {
  return (
    <div>
      Just some text so we know this is actually on screen
      <ErrorMessage></ErrorMessage>
    </div>
  );
}
