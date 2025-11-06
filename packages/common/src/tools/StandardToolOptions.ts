export interface StandardToolOptions {
  useClasses?: boolean;
  commonMdAlign?: boolean;
  classOverride?: { [originalName: string]: string };

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

const classNameRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

export function getCustomClass(
  defaultName: string,
  options: StandardToolOptions
): string {
  if (options && options.classOverride) {
    const name = options.classOverride[defaultName];
    return name && classNameRegex.test(name) ? name : defaultName;
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
