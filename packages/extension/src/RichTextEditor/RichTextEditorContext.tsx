import React, { useContext, useReducer } from "react";
import { RichTextEditorContextProps } from '@dc-extension-rich-text/common';

const context = React.createContext<RichTextEditorContextProps>({
    isLocked: false,
    setIsLocked(locked: boolean) {},
    proseMirrorEditorView: undefined,
    dialogs: {} as any,
    actions: {} as any
});
export default context;

export function useRichTextEditorContext(): RichTextEditorContextProps {
    return useContext(context);
}