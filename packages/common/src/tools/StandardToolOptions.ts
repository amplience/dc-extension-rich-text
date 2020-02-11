import { RichTextDialogs } from "../dialogs";

export interface StandardToolOptions {
  dialogs?: RichTextDialogs;

  tools?: {
    whitelist?: string[];
    blacklist?: string[];

    [toolName: string]: any;
  };
}

export function isToolEnabled(
  toolName: string,
  options: StandardToolOptions
): boolean {
  if (
    options.tools &&
    options.tools.blacklist &&
    options.tools.blacklist.indexOf(toolName) !== -1
  ) {
    return false;
  }
  if (
    options.tools &&
    options.tools.whitelist &&
    options.tools.whitelist.indexOf(toolName) === -1
  ) {
    return false;
  }
  return true;
}
