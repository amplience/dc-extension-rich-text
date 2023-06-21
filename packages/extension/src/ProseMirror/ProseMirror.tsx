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
  onChange?: (doc: any) => void;
  locked?: boolean;
}

interface ProseMirrorState {
  ref: RefObject<any>;
  editorView?: any;
  locked?: boolean;
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
    this.state = { ref, locked: props.locked };
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
    const self = this;

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
        return state;
      },
      editable() {
        return !self.state.locked
      }
    });

    if (onUpdateState) {
      onUpdateState(view.state, view);
    }

    // TODO: Is there a cleaner way than this monkey patch for getting the updated state after a dispatch?
    view.dispatch = (function (this: any, tr: any) {
      var dispatchTransaction = this._props.dispatchTransaction;
      if (dispatchTransaction) {
        return dispatchTransaction.call(this, tr);
      } else {
        return this.updateState(this.state.apply(tr));
      }
    }).bind(view);

    return view;
  }

  public componentDidMount(): void {
    if (this.state.ref && !this.state.editorView) {
      const editorView = this.createEditorView(this.state.ref.current);
      this.setState({ editorView });
    }
  }

  public componentDidUpdate(prevProps: ProseMirrorProps, prevState: ProseMirrorState): void {
    if (prevState.locked !== this.props.locked) {
      this.setState({...prevState, locked: this.props.locked});
    }
  }

  public render(): React.ReactElement {
    const { classes } = this.props;
    return <div className={classes.root} ref={this.state.ref} />;
  }
}

export default withStyles(styles)(ProseMirror);
