import { canInsert, ProseMirrorTool } from "@dc-extension-rich-text/common";
import { BorderClear, FirstPage, LastPage, TableChart, VerticalAlignBottom, VerticalAlignTop } from "@material-ui/icons";
import {
  addColumnAfter,
  addRowAfter,
  deleteColumn,
  deleteRow,
  deleteTable,
} from "prosemirror-tables";
import React from "react";

// tslint:disable-next-line: no-var-requires
const { Fragment } = require('prosemirror-model');

function inTable(state: any): boolean {
  const path = state.selection.$head.path;

  for (let i = 0; i < path.length; i += 3) {
    if (path[i].type.name === 'table') {
      return true;
    }
  }

  return false;
}

function generateEmptyCell(state: any, type: any): any {
  return type.create(undefined, Fragment.fromArray([
      state.schema.nodes.paragraph.create()
    ]));
}

function insertTable(
  state: any,
  dispatch?: (tr: any) => void
): boolean {
  const tr = state.tr.replaceSelectionWith(
    state.schema.nodes.table.create(
      undefined,
      Fragment.fromArray([
        state.schema.nodes.table_row.create(undefined, Fragment.fromArray([
          generateEmptyCell(state, state.schema.nodes.table_header),
          generateEmptyCell(state, state.schema.nodes.table_header),
        ])),
        state.schema.nodes.table_row.create(undefined, Fragment.fromArray([
          generateEmptyCell(state, state.schema.nodes.table_cell),
          generateEmptyCell(state, state.schema.nodes.table_cell),
        ])),
      ])
    )
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}

export function CreateTableTool(schema: any): ProseMirrorTool {
  return {
    name: "table_create",
    label: "Create Table",
    displayIcon: <TableChart />,
    apply: insertTable,
    isEnabled: (state: any) => canInsert(state, schema.nodes.table),
    isVisible: (state: any) => !inTable(state),
  };
}

export function AddRowTool(schema: any): ProseMirrorTool {
  return {
    name: "table_row_add",
    label: "Add Row",
    displayIcon: <VerticalAlignBottom />,
    apply: addRowAfter,
    isVisible: (state: any) => inTable(state),
  };
}

export function AddColumnTool(schema: any): ProseMirrorTool {
  return {
    name: "table_col_add",
    label: "Add Column",
    displayIcon: <LastPage />,
    apply: addColumnAfter,
    isVisible: (state: any) => inTable(state),
  };
}

export function DeleteRowTool(schema: any): ProseMirrorTool {
  return {
    name: "table_row_delete",
    label: "Delete Row",
    displayIcon: <VerticalAlignTop />,
    apply: deleteRow,
    isVisible: (state: any) => inTable(state),
  };
}

export function DeleteColumnTool(schema: any): ProseMirrorTool {
  return {
    name: "table_col_delete",
    label: "Delete Column",
    displayIcon: <FirstPage />,
    apply: deleteColumn,
    isVisible: (state: any) => inTable(state),
  };
}

export function DeleteTableTool(schema: any): ProseMirrorTool {
  return {
    name: "table_delete",
    label: "Delete Table",
    displayIcon: <BorderClear />,
    apply: deleteTable,
    isVisible: (state: any) => inTable(state),
  };
}
