import {
  ProseMirrorTool,
  ProseMirrorToolState,
  RichTextEditorContext
} from "@dc-extension-rich-text/common";

export interface ProseMirrorToolbarState {
  tools: ProseMirrorTool[];
  toolStates: { [toolName: string]: ProseMirrorToolState };
  editorView: any;
  editorContext: RichTextEditorContext | undefined;
}

export function computeToolbarState(
  tools: ProseMirrorTool[],
  editorState: any,
  editorView: any,
  editorContext?: RichTextEditorContext
): ProseMirrorToolbarState {
  const toolStates: { [toolName: string]: ProseMirrorToolState } = {};

  for (const tool of tools) {
    const state = {
      active: false,
      enabled: true,
      visible: true,
      ...tool
    };

    if (tool.isActive) {
      state.active = tool.isActive(editorState, editorView);
    }

    if (tool.isVisible) {
      state.visible = tool.isVisible(editorState, editorView);
    }

    if (tool.isEnabled) {
      state.enabled = tool.isEnabled(editorState, editorView);
    }

    toolStates[tool.name] = state;
  }

  return {
    tools,
    toolStates,
    editorView,
    editorContext
  };
}
