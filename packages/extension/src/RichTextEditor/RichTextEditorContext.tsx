import React, { useContext, useReducer } from "react";
import { RichTextEditorContextProps } from '@dc-extension-rich-text/common';

const context = React.createContext<RichTextEditorContextProps>({
    params: {},
    isLocked: false,
    setIsLocked(locked: boolean) {},
    proseMirrorEditorView: undefined,
    dialogs: {} as any,
    actions: {} as any,
    languages: {}
});
export default context;

export function useRichTextEditorContext(): RichTextEditorContextProps {
    return useContext(context);
}