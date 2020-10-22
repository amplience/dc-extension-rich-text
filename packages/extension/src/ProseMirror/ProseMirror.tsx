import React, { RefObject } from "react";

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
const { sinkListItem, liftListItem } = require("prosemirror-schema-list");
// tslint:disable-next-line
const { undoInputRule } = require("prosemirror-inputrules");

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
  onChange?: (doc: any) => void;
}

interface ProseMirrorState {
  ref: RefObject<any>;
  editorView?: any;
}

let view: any;

function inNestedListNoContent(schema: any, state: any): boolean {
  const { from, to, $cursor } = state.selection;
  
  if (from !== to) {
    return false;
  }

  let listCount = 0;
  let textBlock: any = null;
  state.doc.nodesBetween(from, to, (node: any) => {
    if (node.type === schema.nodes.list_item) {
      listCount++;
    }
    if (node.isTextblock) {
      textBlock = node; // Important to note - this sets in order.
    }
  });

  if (listCount < 2 || textBlock === null) {
    return false;
  }

  return textBlock.childCount === 0;
}

function getKeys(schema: any): any {
  return {
    Tab: sinkListItem(schema.nodes.list_item),
    Backspace: (state: any, dispatch: any, range: any): boolean => {
      let lifted = false;

      // Is the line empty and we're in a list?
      // If so exit the list entirely. (all nested levels)
      if (inNestedListNoContent(schema, state)) {
        while (liftListItem(schema.nodes.list_item)(state, dispatch, range)) {
          state = view.state;
          dispatch = view.dispatch;
          lifted = true;
        }
      }

      return lifted ? true : undoInputRule(state, dispatch, range);
    }
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
        view.updateState(state);

        if (onUpdateState) {
          onUpdateState(state, view);
        }

        if (transactions.some((tr: any) => tr.docChanged)) {
          if (onChange) {
            onChange(state.doc);
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
      view = editorView;
      this.setState({ editorView });
    }
  }

  public render(): React.ReactElement {
    const { classes } = this.props;
    return <div className={classes.root} ref={this.state.ref} />;
  }
}

export default withStyles(styles)(ProseMirror);
