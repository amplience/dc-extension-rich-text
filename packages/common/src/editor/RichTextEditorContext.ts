export interface RichTextEditorContext {
    locked: boolean;
    lockEditor(): void;
    unlockEditor(): void;
}