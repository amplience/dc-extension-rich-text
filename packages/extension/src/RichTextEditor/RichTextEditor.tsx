import { WithStyles, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import CodeTextArea from "../CodeTextArea/CodeTextArea";
import ProseMirror from "../ProseMirror/ProseMirror";
import { EditorView, ViewSwitcher } from "../ViewSwitcher";

import {
  RichLanguageFormat,
  RichTextEditorContextProps,
  RichTextLanguageMap,
} from "@dc-extension-rich-text/common";
import MarkdownLanguage from "@dc-extension-rich-text/language-markdown";
import ProseMirrorToolbar, {
  ToolbarElement,
} from "../ProseMirrorToolbar/ProseMirrorToolbar";
import DefaultToolbar from "./DefaultToolbar";

import {
  computeToolbarState,
  ProseMirrorToolbarState,
} from "../ProseMirrorToolbar/ProseMirrorToolbarState";
import { RichTextActionsImpl } from "../RichTextActions";
import { RichTextDialogsContext } from "../RichTextDialogs";
import RichTextEditorAIActionsBar from "../RichTextEditorAIActionsBar/RichTextEditorAIActionsBar";
import RichtextEditorContext from "./RichTextEditorContext";
import { SdkContext } from "unofficial-dynamic-content-ui";

const styles = {
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  frame: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as "column",
    border: "1px solid rgba(157,162,162,.3)",
    borderRadius: 5,
    padding: "0 10px 10px 10px",
  },
};

export interface RichTextEditorProps extends WithStyles<typeof styles> {
  languages?: RichTextLanguageMap;
  language?: string;
  disableToolbar?: boolean;
  toolbarLayout?: ToolbarElement[];
  disableCodeView?: boolean;
  readOnlyCodeView?: boolean;
  editorViewOptions?: any;
  value?: any;
  onChange?: (value: any) => void;
  params?: any;
}

const RichTextEditor: React.SFC<RichTextEditorProps> = (
  props: RichTextEditorProps
) => {
  const {
    classes,
    languages: languagesProp,
    language: languageProp = "markdown",
    toolbarLayout: toolbarLayoutProp,
    disableToolbar = false,
    disableCodeView = false,
    readOnlyCodeView = false,
    editorViewOptions,
    value: valueProp,
    onChange,
    params,
  } = props;

  const [isLocked, setIsLocked] = useState(false);
  const [proseMirrorEditorView, setProseMirrorEditorView] = useState<
    any | undefined
  >(undefined);
  const { dialogs } = React.useContext(RichTextDialogsContext);
  const [actions] = useState(new RichTextActionsImpl());

  const languages: RichTextLanguageMap = languagesProp || {
    markdown: MarkdownLanguage({}),
  };

  if (!languages[languageProp]) {
    throw new Error(`Unable to find language ${props.language}`);
  }

  const { language, conf: languageConfiguration } = languages[languageProp];
  const { sdk } = React.useContext(SdkContext);

  const editorContext: RichTextEditorContextProps = {
    isLocked,
    setIsLocked,
    proseMirrorEditorView,
    dialogs: dialogs!,
    actions,
    params,
    languages,
    language,
    sdk,
  };

  actions.setRichTextEditorContext(editorContext);

  const [view, setView] = React.useState(EditorView.EDIT);
  const [rawValue, setRawValue] = React.useState(() => {
    if (!valueProp) {
      return undefined;
    }

    if (languageConfiguration.format === RichLanguageFormat.JSON) {
      return JSON.stringify(valueProp, null, 3);
    } else {
      return valueProp;
    }
  });
  const [proseMirrorDocument, setProseMirrorDocument] = React.useState(() => {
    if (!valueProp) {
      return undefined;
    }

    try {
      return language.parse(valueProp);
      // tslint:disable-next-line
    } catch (err) {}
  });

  const handleRawValueChange = React.useCallback(
    (value: any) => {
      setRawValue(value);

      if (languageConfiguration.format === RichLanguageFormat.JSON) {
        try {
          value = JSON.parse(value);
        } catch (err) {
          return;
        }
      }

      if (onChange) {
        onChange(value);
      }

      try {
        const newProseMirrorDocument = language.parse(value);
        setProseMirrorDocument(newProseMirrorDocument);
        // tslint:disable-next-line
      } catch (err) {}
    },
    [
      languageConfiguration,
      setRawValue,
      setProseMirrorDocument,
      onChange,
      language,
    ]
  );

  const handleEditorChange = React.useCallback(
    (doc: any) => {
      setProseMirrorDocument(doc);
      try {
        const newRawValue = language.serialize(doc);

        if (languageConfiguration.format === RichLanguageFormat.JSON) {
          setRawValue(JSON.stringify(newRawValue, null, 3));
        } else {
          setRawValue(newRawValue);
        }

        if (onChange) {
          onChange(newRawValue);
        }
        // tslint:disable-next-line
      } catch (err) {}
    },
    [
      languageConfiguration,
      setProseMirrorDocument,
      setRawValue,
      language,
      onChange,
    ]
  );

  const [toolbarState, setToolbarState] = React.useState<
    ProseMirrorToolbarState
  >();
  const toolbarLayout = toolbarLayoutProp || DefaultToolbar;

  const handleEditorUpdateState = React.useCallback(
    (state: any, editorView: any) => {
      setProseMirrorEditorView(editorView);
      setToolbarState(
        computeToolbarState(language.tools, state, editorContext)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, setToolbarState]
  );

  return (
    <RichtextEditorContext.Provider value={editorContext}>
      <div className={classes.root}>
        <div className={classes.frame}>
          <ViewSwitcher
            onChange={setView}
            language={language.label}
            disableCodeView={disableCodeView}
          />
          {view === EditorView.EDIT ? (
            <div>
              {disableToolbar ? (
                false
              ) : (
                <ProseMirrorToolbar
                  toolbarState={toolbarState}
                  layout={toolbarLayout}
                  isLocked={editorContext.isLocked}
                />
              )}
              <div style={{ position: "relative" }}>
                <ProseMirror
                  editorViewOptions={editorViewOptions}
                  schema={language.schema}
                  onChange={handleEditorChange}
                  onUpdateState={handleEditorUpdateState}
                  doc={proseMirrorDocument}
                  isLocked={editorContext.isLocked}
                />
                <RichTextEditorAIActionsBar />
              </div>
            </div>
          ) : (
            <CodeTextArea
              value={rawValue}
              onChange={handleRawValueChange}
              readOnly={editorContext.isLocked || readOnlyCodeView}
            />
          )}
        </div>
      </div>
    </RichtextEditorContext.Provider>
  );
};

export default withStyles(styles)(RichTextEditor);
