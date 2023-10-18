import { RichTextActions } from "../actions";
import { RichTextDialogs } from "../dialogs";
import { RichLanguage, RichTextLanguageMap } from "../languages";

export interface RichTextEditorContextProps {
  params: any;
  isLocked: boolean;
  proseMirrorEditorView: any | undefined;
  dialogs: RichTextDialogs;
  actions: RichTextActions;
  languages: RichTextLanguageMap;
  language: RichLanguage;
  setIsLocked(locked: boolean): void;
  sdk: any;
}
