import { StandardToolOptions } from "@dc-extension-rich-text/common";
import { ContentTypeExtensionSettings, OldContentTypeExtensionSettings } from "../ContentTypeExtensionSettings";

export type DynamicContentToolOptions = StandardToolOptions & {
  dynamicContent?: {
    stagingEnvironment?: string;
  };
  tools?: {
    "dc-content-link"?: {
      contentTypes?: string[];
      contentTypeSettings?: ContentTypeExtensionSettings[] | OldContentTypeExtensionSettings
    };
  };
};
