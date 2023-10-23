import { ContentFieldExtension } from "dc-extensions-sdk";
import React from "react";
export interface SdkContextProps {
  sdk?: ContentFieldExtension;
}
declare const context: React.Context<SdkContextProps>;
export default context;
