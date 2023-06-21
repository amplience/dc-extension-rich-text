import { RichTextActions } from "../actions";
import { RichTextDialogs } from "../dialogs";

export interface RichTextEditorContextProps {
    isLocked: boolean;
    setIsLocked(locked: boolean): void;
    proseMirrorEditorView: any | undefined;
    dialogs: RichTextDialogs;
    actions: RichTextActions;
}