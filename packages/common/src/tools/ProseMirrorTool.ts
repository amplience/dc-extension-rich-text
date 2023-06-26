import { RichTextEditorContextProps } from "../editor";

export interface ProseMirrorTool {
  name: string;
  label: string;

  displayLabel?: React.ReactElement;
  displayIcon?: React.ReactElement;

  isVisible?(
    state: any,
    richTextEditorContext: RichTextEditorContextProps
  ): boolean;
  isEnabled?(
    state: any,
    richTextEditorContext: RichTextEditorContextProps
  ): boolean;
  isActive?(
    state: any,
    richTextEditorContext: RichTextEditorContextProps
  ): boolean;
  apply(
    state: any,
    dispatch: any,
    richTextEditorContext: RichTextEditorContextProps
  ): void;
}
