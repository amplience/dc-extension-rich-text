export interface ProseMirrorTool {
  name: string;
  label: string;

  displayLabel?: React.ReactElement;
  displayIcon?: React.ReactElement;

  isVisible?(editorState: any, editorView?: any): boolean;
  isEnabled?(editorState: any, editorView?: any): boolean;
  isActive?(editorState: any, editorView?: any): boolean;
  apply(state: any, dispatch: any, editorView: any): void;
}
