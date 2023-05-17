import React from "react";
import { WithStyles, withStyles } from "@material-ui/core";
import CodeTextArea from "../CodeTextArea/CodeTextArea";
import ProseMirror from "../ProseMirror/ProseMirror";
import { EditorView, ViewSwitcher } from "../ViewSwitcher";

import {
  RichLanguage,
  RichLanguageConfiguration,
  RichLanguageFormat
} from "@dc-extension-rich-text/common";
import MarkdownLanguage from "@dc-extension-rich-text/language-markdown";
import ProseMirrorToolbar, {
  ToolbarElement
} from "../ProseMirrorToolbar/ProseMirrorToolbar";
import DefaultToolbar from "./DefaultToolbar";

import { computeToolbarState, ProseMirrorToolbarState } from "../ProseMirrorToolbar/ProseMirrorToolbarState";
import { RichTextDialogsContext } from "../RichTextDialogs";

const styles = {
  root: {
    width: "100%",
    height: "100%",
    display: "flex"
  },
  frame: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as "column",
    border: "1px solid rgba(157,162,162,.3)",
    borderRadius: 5,
    padding: "0 10px 10px 10px"
  }
};

interface RichTextLanguageMap {
  [name: string]: { language: RichLanguage; conf: RichLanguageConfiguration };
}

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
}

const RichTextEditor: React.FC<RichTextEditorProps> = (
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
    onChange
  } = props;

  const { dialogs } = React.useContext(RichTextDialogsContext);

  const languages: RichTextLanguageMap = languagesProp || {
    markdown: MarkdownLanguage({
      dialogs
    })
  };

  if (!languages[languageProp]) {
    throw new Error(`Unable to find language ${props.language}`);
  }

  const { language, conf: languageConfiguration } = languages[languageProp];

  const contentRef = React.useRef<any[]>([]);
  const [view, setView] = React.useState(EditorView.EDIT);
  const [rawValue, setRawValue] = React.useState(() => {
    if (!valueProp) {
      return undefined;
    }
    if (valueProp[0] && valueProp[0].content) {
      contentRef.current = valueProp[0].content;
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
    } catch (err) {
    }
  });

  function onlyUnique(value: {id: string}, index: number, self: {id: string}[]) {
    return self.findIndex((item) => item.id === value.id) === index;
  }
  

  const cleanContent = (doc: any, content: any) => {
    if (content.length === 0) return
    const marks: string[] = [];
    searchMarks(doc, marks);
    const markContent = content.filter((item: any) => marks.includes('id:' + item.id)).filter(onlyUnique)
    if (content.length !== markContent.length) {
      return markContent;
    }
    return content;
  }

  const searchMarks = (doc: any, marks: string[]) => {
    if (doc && doc.content && doc.content.content) {
      doc.content.content.forEach((node: any) => {
        const linkMark = node.marks.find((mark: any) => mark.type.name === 'link')
        if (linkMark) {
          marks.push(linkMark.attrs.href)
        }
        searchMarks(node, marks);
      })
    }
  }

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
    [languageConfiguration, setRawValue, setProseMirrorDocument, onChange]
  );

  const handleEditorChange = React.useCallback(
    (doc: any, types: any) => {
      setProseMirrorDocument(doc);
      try {
        let currentContent = contentRef.current;
        if (types['content-type']) {
          currentContent = cleanContent(doc,[...currentContent, JSON.parse(types['content-type'])]);
          contentRef.current = currentContent
        }
        const newRawValue = language.serialize(doc) as any[];
        if (currentContent.length > 0 && newRawValue.length > 0) {
          newRawValue[0].content = currentContent;
        }
        if (languageConfiguration.format === RichLanguageFormat.JSON) {
          setRawValue(JSON.stringify(newRawValue, null, 3));
        } else {
          setRawValue(newRawValue);
        }
        
        if (onChange) {
          onChange(newRawValue)
        }
        // tslint:disable-next-line
      } catch (err) {}
    },
    [languageConfiguration, setProseMirrorDocument, setRawValue]
  );

  const [toolbarState, setToolbarState] = React.useState<ProseMirrorToolbarState>();
  const toolbarLayout = toolbarLayoutProp || DefaultToolbar;

  const handleEditorUpdateState = React.useCallback(
    (state: any, editorView: any) => {
      setToolbarState(computeToolbarState(language.tools, state, editorView));
    },
    [language, setToolbarState]
  );

  return (
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
              />
            )}
            <ProseMirror
              editorViewOptions={editorViewOptions}
              schema={language.schema}
              onChange={handleEditorChange}
              onUpdateState={handleEditorUpdateState}
              doc={proseMirrorDocument}
            />
          </div>
        ) : (
          <CodeTextArea
            value={rawValue}
            onChange={handleRawValueChange}
            readOnly={readOnlyCodeView}
          />
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(RichTextEditor);
