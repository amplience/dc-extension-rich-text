import { GenerateContentPrompt } from "../dialogs";
import { RichTextEditorContext } from "../editor";

export interface RichTextActions {
    insertGeneratedContent(state: any, dispatch: any, rteContext: RichTextEditorContext, prompt: GenerateContentPrompt): Promise<void>;
}