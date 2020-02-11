import { RichTextDialogs } from "@dc-extension-rich-text/common";
import React from "react";

export interface RichTextDialogsContext {
  dialogs?: RichTextDialogs;
}

const context = React.createContext<RichTextDialogsContext>({});
export default context;
