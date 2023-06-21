import { GenerateContentPrompt } from "../dialogs";

export interface RichTextActions {
  insertGeneratedContent(
    state: any,
    dispatch: any,
    prompt: GenerateContentPrompt
  ): Promise<void>;
  rewriteSelectedContentUsingGenerativeAI(
    from: number,
    to: number,
    prompt: string
  ): Promise<void>;
}
