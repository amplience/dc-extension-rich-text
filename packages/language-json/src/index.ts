import {
  RichLanguage,
  RichLanguageConfiguration,
} from "@dc-extension-rich-text/common";
import { DynamicContentToolOptions } from "@dc-extension-rich-text/prosemirror-dynamic-content";
import JSONLanguage from "./JSONLanguage";
import JSONLanguageConfiguration from "./JSONLanguageConfiguration";

export default function(
  options: DynamicContentToolOptions
): { language: RichLanguage; conf: RichLanguageConfiguration } {
  return {
    language: new JSONLanguage(options),
    conf: JSONLanguageConfiguration,
  };
}

export * from "./JSONLanguage";
export * from "./JSONLanguageConfiguration";
export * from "./blocks/Block";
export * from "./blocks/DcImageLinkBlock";
export * from "./blocks/MarkdownBlock";
