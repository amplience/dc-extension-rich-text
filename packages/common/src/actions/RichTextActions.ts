import { GenerateContentPrompt } from "../dialogs";

export interface RichTextActions {
    insertGeneratedContent(state: any, dispatch: any, prompt: GenerateContentPrompt): Promise<void>;
}