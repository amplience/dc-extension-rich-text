import React, { RefObject } from "react";

import "./ProseMirror.scss";

import { WithStyles, withStyles } from "@material-ui/core";

// tslint:disable-next-line
const EditorState = require("prosemirror-state").EditorState;
// tslint:disable-next-line
const EditorView = require("prosemirror-view").EditorView;
// tslint:disable-next-line
const exampleSetup = require("prosemirror-example-setup").exampleSetup;

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

class ProseMirror extends React.Component<ProseMirrorProps, ProseMirrorState> {
  constructor(props: ProseMirrorProps) {
    super(props);
    const ref = React.createRef();
    this.state = { ref };
  }

  public createEditorState(): any {
    const { schema, doc } = this.props;

    return EditorState.create({
      schema,
      doc,
      plugins: exampleSetup({ schema, menuBar: false })
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
      this.setState({ editorView });
    }
  }

  public render(): React.ReactElement {
    const { classes } = this.props;
    return <div className={classes.root} ref={this.state.ref} />;
  }
}

export default withStyles(styles)(ProseMirror);
