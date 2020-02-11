import { storiesOf } from "@storybook/react";
import React, { PropsWithChildren } from "react";

import { Button } from "@material-ui/core";
import RichTextDialogsContainer from "./RichTextDialogsContainer";
import RichTextDialogsContext from "./RichTextDialogsContext";

interface DialogButtonProps extends PropsWithChildren<{}> {
  type: string;
  initialValue?: any;
}

const DialogButton: React.SFC<DialogButtonProps> = (
  props: DialogButtonProps
) => {
  const { children, type } = props;
  const { dialogs } = React.useContext(RichTextDialogsContext);

  const openDialog = async (value?: any): Promise<void> => {
    if (!dialogs) {
      return;
    }
    const newValue = await (dialogs as any)[type](value);
    // tslint:disable-next-line
    console.log(newValue);
  };

  return (
    <div>
      <Button onClick={() => openDialog()}>{children}</Button>
    </div>
  );
};

storiesOf("RichTextDialogsContainer", module)
  .add("Hyperlink", () => (
    <RichTextDialogsContainer>
      <DialogButton type="getHyperlink">Get Hyperlink</DialogButton>
    </RichTextDialogsContainer>
  ))
  .add("Insert Image", () => (
    <RichTextDialogsContainer>
      <DialogButton type="getImage">Insert Image</DialogButton>
    </RichTextDialogsContainer>
  ));
