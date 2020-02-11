import React from "react";

import { ProseMirrorToolState } from "@dc-extension-rich-text/common";

export interface ProseMirrorToolbarContextInterface {
  getToolState?(toolName: string): ProseMirrorToolState | undefined;
  applyTool?(toolName: string): void;
}

const ProseMirrorToolbarContext = React.createContext<
  ProseMirrorToolbarContextInterface
>({});
export default ProseMirrorToolbarContext;
