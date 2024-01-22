import {
  ProseMirrorTool,
  ProseMirrorToolState,
  RichTextEditorContextProps,
} from "@dc-extension-rich-text/common";

export interface ProseMirrorToolbarState {
  tools: ProseMirrorTool[];
  toolStates: { [toolName: string]: ProseMirrorToolState };
  params: Record<string, unknown>;
}

export function computeToolbarState(
  tools: ProseMirrorTool[],
  editorState: any,
  richTextEditorContext: RichTextEditorContextProps
): ProseMirrorToolbarState {
  const toolStates: { [toolName: string]: ProseMirrorToolState } = {};

  for (const tool of tools) {
    const state = {
      active: false,
      enabled: true,
      visible: true,
      ...tool,
    };

    if (tool.isActive) {
      state.active = tool.isActive(editorState, richTextEditorContext);
    }

    if (tool.isVisible) {
      state.visible = tool.isVisible(editorState, richTextEditorContext);
    }

    if (tool.isEnabled) {
      state.enabled = tool.isEnabled(editorState, richTextEditorContext);
    }

    toolStates[tool.name] = state;
  }

  return {
    tools,
    toolStates,
    params: {},
  };
}
