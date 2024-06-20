export interface RichTextActions {
  insertAIContent(prompt: string, keywords: string[]): Promise<void>;
  rewriteSelectedContentUsingAI(
    prompt: string,
    keywords: string[]
  ): Promise<void>;
  insertContentStudioContent(): Promise<void>;
}
