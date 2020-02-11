import { ProseMirrorTool } from "../tools";
import { RichLanguageConfiguration } from "./RichLanguageConfiguration";

export interface RichLanguage {
  readonly name: string;
  readonly label: string;
  readonly schema: any;
  readonly tools: ProseMirrorTool[];

  /**
   * Serialize a prosemirror document into data
   * @param doc
   */
  serialize(doc: any): any;

  /**
   * Parse data into a prosemirror document
   * @param data
   */
  parse(data: any): any;
}
