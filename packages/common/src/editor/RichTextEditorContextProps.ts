import { RichTextActions } from "../actions";
import { RichTextDialogs } from "../dialogs";
import { RichTextLanguageMap } from "../languages";

export interface RichTextEditorContextProps {
    params: any;
    isLocked: boolean;
    setIsLocked(locked: boolean): void;
    proseMirrorEditorView: any | undefined;
    dialogs: RichTextDialogs;
    actions: RichTextActions;
    languages: RichTextLanguageMap;
}