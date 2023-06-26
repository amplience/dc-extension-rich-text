import { ContentItemLink, MediaImageLink } from "dc-extensions-sdk";
import React from "react";

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

export type AlertSeverity = "info" | "success" | "error" | "warning";

export interface AlertOptions {
  title: string;
  severity: AlertSeverity;
  content: string | React.ReactElement;
  icon?: React.ReactElement;
}

export interface Alert extends AlertOptions {
  id: string;
  updateContent(content: string | React.ReactElement): void;
}

export interface AIPromptDialogOptions {
  variant: "generate" | "rewrite";
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
  getAIPrompt(options: AIPromptDialogOptions): Promise<string>;
  alert(options: AlertOptions): Alert;
}
