import React, { RefObject, useState } from "react";

import "./ProseMirror.scss";

import { WithStyles, withStyles } from "@material-ui/core";

// tslint:disable-next-line
const EditorState = require("prosemirror-state").EditorState;
// tslint:disable-next-line
const EditorView = require("prosemirror-view").EditorView;
// tslint:disable-next-line
const exampleSetup = require("prosemirror-example-setup").exampleSetup;
// tslint:disable-next-line
const { tableEditing, columnResizing } = require("prosemirror-tables");
// tslint:disable-next-line
const keymap = require("prosemirror-keymap").keymap;
// tslint:disable-next-line
const { sinkListItem } = require("prosemirror-schema-list");

const styles = {
  root: {
    width: "100%",
    minHeight: 250,
    maxHeight: 600,
    overflowY: "scroll" as "scroll"
  }
};

export interface ProseMirrorProps extends WithStyles<typeof styles> {
  schema: any;
  doc?: any;
  editorViewOptions?: any;
  onUpdateState?: (state: any, editorView: any) => void;
  onChange?: (doc: any, types: any) => void;
}

interface ProseMirrorState {
  ref: RefObject<any>;
  editorView?: any;
}

function getKeys(schema: any): any {
  return {
    Tab: sinkListItem(schema.nodes.list_item)
  }
}

class ProseMirror extends React.Component<ProseMirrorProps, ProseMirrorState> {
  constructor(props: ProseMirrorProps) {
    super(props);
    const ref = React.createRef();
    this.state = { ref };
  }

  
  public createEditorState(): any {
    const { schema, doc } = this.props;

    const withTablePlugins = schema.nodes.table != null;
    const tablePlugins = withTablePlugins ? [ columnResizing(), tableEditing() ] : [];

    return EditorState.create({
      schema,
      doc,
      plugins: [
        ...tablePlugins,
        keymap(getKeys(schema)),
        ...exampleSetup({ schema, menuBar: false }), // can pass mapkeys to suppress some bindings
      ]
    });
  }

  public createEditorView(parent: any): any {
    const { onUpdateState, onChange } = this.props;

    const editorState = this.createEditorState();

    const view = new EditorView(parent, {
      ...this.props.editorViewOptions,
      state: editorState,
      dispatchTransaction: (transaction: any) => {
        const { state, transactions } = view.state.applyTransaction(
          transaction
        );
        if (transaction.meta['content-type']) {
          if (onUpdateState && onChange) {
            const contentData = {...transaction.meta}
            view.updateState(state);
            onUpdateState(state, view);
            onChange(state.doc, contentData);
            this.forceUpdate();
            return
          }
        }
        view.updateState(state);

        if (onUpdateState) {
          onUpdateState(state, view);
        }

        if (transactions.some((tr: any) => tr.docChanged)) {
          if (onChange) {
            onChange(state.doc, {});
          }
        }

        this.forceUpdate();
      }
    });

    if (onUpdateState) {
      onUpdateState(view.state, view);
    }

    return view;
  }

  public componentDidMount(): void {
    if (this.state.ref && !this.state.editorView) {
      const editorView = this.createEditorView(this.state.ref.current);
      this.setState({ editorView });
    }
  }

  public render(): React.ReactElement {
    const { classes } = this.props;
    return <div id='this' className={classes.root} ref={this.state.ref} />;
  }
}

export default withStyles(styles)(ProseMirror);
