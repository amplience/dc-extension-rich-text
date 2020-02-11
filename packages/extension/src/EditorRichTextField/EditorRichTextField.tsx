import React from "react";

import { withStyles, WithStyles } from "@material-ui/core";

import { ToolbarElement } from "../ProseMirrorToolbar";
import { RichTextEditor } from "../RichTextEditor";

import JSONLanguage from "@dc-extension-rich-text/language-json";
import MarkdownLanguage from "@dc-extension-rich-text/language-markdown";
import { ContentTypeSettings, SdkContext } from "unofficial-dynamic-content-ui";

import {
  RichLanguage,
  RichLanguageConfiguration
} from "@dc-extension-rich-text/common";
import {
  DcContentLinkView,
  DcImageLinkView,
  DynamicContentToolOptions
} from "@dc-extension-rich-text/prosemirror-dynamic-content";
import { RichTextDialogsContext } from "../RichTextDialogs";

export const styles = {
  root: {
    width: "100%"
  }
};

export interface EditorRichTextFieldProps extends WithStyles<typeof styles> {
  schema: any;
  value?: any;
  onChange?: (value: any) => void;
}

export interface EditorRichTextFieldParams {
  language?: string;

  styles?: string;
  stylesheet?: string;

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
      contentTypeSettings?: ContentTypeSettings & {
        aspectRatios?: { [schemaId: string]: string };
      };
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
      }
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
