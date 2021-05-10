import { ContentTypeSettings } from "unofficial-dynamic-content-ui";

export interface ContentTypeExtensionSettings {
  id: string;
  icon?: string;
  card?: string;
  aspectRatio?: string;
}

export type OldContentTypeExtensionSettings = ContentTypeSettings & {
  aspectRatios?: { [schemaId: string]: string };
};
