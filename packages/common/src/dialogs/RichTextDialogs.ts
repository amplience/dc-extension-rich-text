import { ContentItemLink, MediaImageLink } from "dc-extensions-sdk";

export interface Image {
  src: string;
  alt: string;
  title: string;
}

export interface Hyperlink {
  href: string;
  title: string;
  cancel?: boolean;
}

export interface Anchor {
  value: string;
}

export interface Code {
  params?: string;
}

export interface GenerateContentPrompt {
  prompt: string;
}

export interface RichTextDialogs {
  getAnchor(existing: Set<string>, value?: Anchor): Promise<Anchor>;
  getCode(value?: string): Promise<string>;
  getHyperlink(value?: Hyperlink): Promise<Hyperlink>;
  getImage(value?: Image): Promise<Image>;
  getDcImageLink(value?: MediaImageLink): Promise<MediaImageLink>;
  getDcContentLink(
    contentTypeIds: string[],
    value?: ContentItemLink
  ): Promise<ContentItemLink>;
  getGenerateContentPrompt(): Promise<GenerateContentPrompt>;
}
