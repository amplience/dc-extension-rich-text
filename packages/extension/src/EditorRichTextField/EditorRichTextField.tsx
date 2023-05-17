import React from "react";

import { withStyles, WithStyles } from "@material-ui/core";

import { ToolbarElement } from "../ProseMirrorToolbar";
import { RichTextEditor } from "../RichTextEditor";

import JSONLanguage from "@dc-extension-rich-text/language-json";
import MarkdownLanguage from "@dc-extension-rich-text/language-markdown";
import { SdkContext } from "unofficial-dynamic-content-ui";

import {
  RichLanguage,
  RichLanguageConfiguration
} from "@dc-extension-rich-text/common";
import {
  DcContentLinkView,
  DcImageLinkView,
  DynamicContentToolOptions,
  ContentTypeExtensionSettings,
  OldContentTypeExtensionSettings
} from "@dc-extension-rich-text/prosemirror-dynamic-content";
import { RichTextDialogsContext } from "../RichTextDialogs";

export const styles = {
  root: {
    width: "100%"
  },
  title: {
    padding: "7px 0",
    minHeight: "20px",
    color: "#666",
    fontSize: "13px",
    boxSizing: "border-box" as "border-box",
    "-webkit-font-smoothing": "auto",
    fontFamily: "roboto,sans-serif!important"
  },
};

export interface EditorRichTextFieldProps extends WithStyles<typeof styles> {
  schema: any;
  value?: any;
  onChange?: (value: any) => void;
}

export interface EditorRichTextFieldParams {
  title?: string;
  language?: string;

  styles?: string;
  stylesheet?: string;

  useClasses?: boolean;
  classOverride?: { [originalName: string]: string };

  codeView?: {
    readOnly?: boolean;
    disabled?: boolean;
  };

  editView?: {};

  toolbar?: {
    layout?: ToolbarElement[];
    disabled?: boolean;
  };

  tools?: {
    whitelist?: string[];
    blacklist?: string[];

    "dc-content-link"?: {
      contentTypes?: string[];
      contentTypeSettings?:
        | ContentTypeExtensionSettings[]
        | OldContentTypeExtensionSettings;
    };
  };
}

const EditorRichTextField: React.SFC<EditorRichTextFieldProps> = (
  props: EditorRichTextFieldProps
) => {
  const { schema, value: valueProp, onChange, classes } = props;

  const params: EditorRichTextFieldParams =
    schema && schema["ui:extension"] && schema["ui:extension"].params
      ? schema["ui:extension"].params
      : {};

  const { sdk } = React.useContext(SdkContext);
  const { dialogs } = React.useContext(RichTextDialogsContext);

  const toolOptions = React.useMemo<DynamicContentToolOptions>(() => {
    const settings = {
      useClasses: params.useClasses,
      classOverride: params.classOverride,

      dialogs,
      dynamicContent: {
        stagingEnvironment: sdk ? sdk.stagingEnvironment : undefined
      },
      tools: params.tools
    };

    if (settings.tools && !settings.tools.blacklist) {
      // disable inline_styles by default
      settings.tools.blacklist = ["inline_styles"];
    }

    return settings;
  }, [sdk, dialogs, params]);

  const languages = React.useMemo<{
    [name: string]: { language: RichLanguage; conf: RichLanguageConfiguration };
  }>(() => {
    return {
      markdown: MarkdownLanguage(toolOptions),
      json: JSONLanguage(toolOptions)
    };
  }, []);

  const language = params.language || "markdown";

  const editorViewOptions = React.useMemo(() => {
    return {
      nodeViews: {
        "dc-image-link": (node: any, view: any, getPos: any) =>
          new DcImageLinkView(node, view, getPos, toolOptions),
        "dc-content-link": (node: any, view: any, getPos: any) =>
          new DcContentLinkView(node, view, getPos, toolOptions)
      },
    };
  }, [sdk, toolOptions]);

  return (
    <div className={classes.root}>
      {params.styles ? (
        <style dangerouslySetInnerHTML={{ __html: params.styles }} />
      ) : (
        false
      )}
      {params.stylesheet ? (
        <link rel="stylesheet" href={params.stylesheet} />
      ) : (
        false
      )}

      {params.title ? (
        <div className={classes.title}>{params.title}</div>
      ) : (
        false
      )}

      <RichTextEditor
        languages={languages}
        language={params.language}
        editorViewOptions={editorViewOptions}
        toolbarLayout={params.toolbar ? params.toolbar.layout : undefined}
        disableToolbar={params.toolbar ? params.toolbar.disabled : undefined}
        disableCodeView={params.codeView ? params.codeView.disabled : undefined}
        readOnlyCodeView={
          params.codeView ? params.codeView.readOnly : undefined
        }
        onChange={onChange}
        value={valueProp}
      />
    </div>
  );
};

export default withStyles(styles)(EditorRichTextField);
