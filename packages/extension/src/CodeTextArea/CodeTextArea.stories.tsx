import { storiesOf } from "@storybook/react";
import React from "react";
import CodeTextArea from "./CodeTextArea";

storiesOf("CodeTextArea", module).add("Component", () => {
  const [value, setValue] = React.useState("# heading 1");

  return <CodeTextArea value={value} onChange={setValue} />;
});
