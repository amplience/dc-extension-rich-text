import { storiesOf } from "@storybook/react";
import React from "react";
import RichTextDialogsContainer from "../RichTextDialogs/RichTextDialogsContainer";
import RichTextEditor from "./RichTextEditor";

storiesOf("RichTextEditor", module).add("Component", () => {
  const [value, setValue] = React.useState("# heading 1");
  return (
    <RichTextDialogsContainer>
      <RichTextEditor />
    </RichTextDialogsContainer>
  );
});
