import { StandardToolOptions } from "@dc-extension-rich-text/common";
import { ContentTypeSettings } from "unofficial-dynamic-content-ui";

export type DynamicContentToolOptions = StandardToolOptions & {
  dynamicContent?: {
    stagingEnvironment?: string;
  };
  tools?: {
    "dc-content-link"?: {
      contentTypes?: string[];
      contentTypeSettings?: ContentTypeSettings & {
        aspectRatios?: { [schemaId: string]: string };
      };
    };
  };
};
