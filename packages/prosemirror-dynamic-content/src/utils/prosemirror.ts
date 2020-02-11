// tslint:disable-next-line
import "prosemirror-example-setup/style/style.css";
// tslint:disable-next-line
import "prosemirror-menu/style/menu.css";
// tslint:disable-next-line
import "prosemirror-view/style/prosemirror.css";
import "./prosemirror.css";

// tslint:disable-next-line
const { EditorState } = require("prosemirror-state");
// tslint:disable-next-line
const { EditorView } = require("prosemirror-view");
// tslint:disable-next-line
const { DOMParser } = require("prosemirror-model");
// tslint:disable-next-line
const basicSchema = require("prosemirror-schema-basic");
// tslint:disable-next-line
const { exampleSetup, buildMenuItems } = require("prosemirror-example-setup");

// tslint:disable-next-line
const { MenuItem } = require("prosemirror-menu");

// tslint:disable-next-line
const Node = require("prosemirror-model").Node;

export function createBlockMenu(label: string, nodeType: any, attrs: any): any {
  return new MenuItem({
    label,
    run: (state: any, dispatch: any, view: any) => {
      dispatch(state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
    }
  });
}

export function createEditor({
  modifySchema,
  modifyMenu,
  modifyOptions,
  doc
}: {
  modifySchema?: (schema: any) => any;
  modifyMenu?: (menu: any, schema: any) => any;
  modifyOptions?: (options: any) => any;
  doc?: any;
}): any {
  let schema = basicSchema;
  if (modifySchema) {
    schema = modifySchema(basicSchema);
  }

  let menu = buildMenuItems(schema);
  if (modifyMenu) {
    menu = modifyMenu(menu, schema);
  }

  const container = document.createElement("div");

  let options = {
    state: EditorState.create({
      doc: doc
        ? Node.fromJSON(schema, doc)
        : DOMParser.fromSchema(schema).parse(""),
      plugins: exampleSetup({ schema, menuContent: menu.fullMenu })
    })
  };

  if (modifyOptions) {
    options = modifyOptions(options);
  }

  const view = new EditorView(container, options);

  return {
    container,
    schema,
    view
  };
}
