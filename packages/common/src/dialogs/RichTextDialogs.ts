import { ContentItemLink, MediaImageLink } from "dc-extensions-sdk";

export interface Image {
  src: string;
  alt: string;
  title: string;
}

export interface Hyperlink {
  href: string;
  title: string;
}

export interface Anchor {
  value: string;
}

export interface RichTextDialogs {
  getAnchor(value?: Anchor): Promise<Anchor>;
  getHyperlink(value?: Hyperlink): Promise<Hyperlink>;
  getImage(value?: Image): Promise<Image>;
  getDcImageLink(value?: MediaImageLink): Promise<MediaImageLink>;
  getDcContentLink(
    contentTypeIds: string[],
    value?: ContentItemLink
  ): Promise<ContentItemLink>;
}
