export interface RichTextActions {
  insertAIContent(prompt: string): Promise<void>;

  rewriteSelectedContentUsingAI(prompt: string): Promise<void>;
}
