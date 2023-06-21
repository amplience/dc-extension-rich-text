import { RichLanguage } from "./RichLanguage";
import { RichLanguageConfiguration } from "./RichLanguageConfiguration";

export interface RichTextLanguageMap {
  [name: string]: { language: RichLanguage; conf: RichLanguageConfiguration };
}