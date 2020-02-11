import MarkdownLanguage from "./MarkdownLanguage";
import MarkdownLanguageConfiguration from "./MarkdownLanguageConfiguration";

import {
  RichLanguage,
  RichLanguageConfiguration,
  StandardToolOptions
} from "@dc-extension-rich-text/common";

export default function(
  options: StandardToolOptions
): { language: RichLanguage; conf: RichLanguageConfiguration } {
  return {
    language: new MarkdownLanguage(options),
    conf: MarkdownLanguageConfiguration
  };
}

export * from "./schema/createSchema";
