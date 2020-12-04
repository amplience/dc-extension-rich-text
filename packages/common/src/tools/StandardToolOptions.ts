import { RichTextDialogs } from "../dialogs";

export interface StandardToolOptions {
  useClasses?: boolean;
  classOverride?: { [originalName: string]: string };

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

export function getCustomClass(
  defaultName: string,
  options: StandardToolOptions
): string {
  if (options && options.classOverride && options.classOverride[defaultName]) {
    return options.classOverride[defaultName];
  }

  return defaultName;
}

export function getDefaultClass(
  customName: string,
  options: StandardToolOptions
): string {
  if (options && options.classOverride) {
    const classes = options.classOverride;
    const keys = Object.keys(classes);
    return keys.find(key => classes[key] === customName) || customName;
  }

  return customName;
}

