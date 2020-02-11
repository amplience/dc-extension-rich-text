import { storiesOf } from "@storybook/react";
import React from "react";

import ProseMirror from "./ProseMirror";

// tslint:disable-next-line
const schema = require("prosemirror-schema-basic").schema;

storiesOf("ProseMirror", module).add("Component", () => (
  <ProseMirror schema={schema} />
));
