import { RichTextEditorContextProps } from "@dc-extension-rich-text/common";
import React, { useContext } from "react";

const context = React.createContext<RichTextEditorContextProps>({
  params: {},
  isLocked: false,
  proseMirrorEditorView: undefined,
  dialogs: {} as any,
  actions: {} as any,
  languages: {},
  language: {} as any,
  sdk: {} as any,
  setIsLocked: (locked: boolean) => {},
  setShowCreditsError: (show: boolean) => {},
});
export default context;

export function useRichTextEditorContext(): RichTextEditorContextProps {
  return useContext(context);
}
