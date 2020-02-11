import { storiesOf } from "@storybook/html";

import "../../style/style.css";
import { createBlockMenu, createEditor } from "../utils/prosemirror";
import { DcImageLinkNode } from "./DcImageLinkNode";
import { DcImageLinkView } from "./DcImageLinkView";

// tslint:disable-next-line
const { Schema } = require("prosemirror-model");

storiesOf("DcImageLinkNode", module).add("Editor", () => {
  const { container } = createEditor({
    modifySchema: (schema: any) => {
      return new Schema({
        marks: schema.schema.spec.marks,
        nodes: schema.schema.spec.nodes.addBefore(
          "image",
          "dc-image-link",
          DcImageLinkNode()
        )
      });
    },

    modifyMenu: (menu: any, schema: any) => {
      menu.insertMenu.content.push(
        createBlockMenu("Insert Image", schema.nodes["dc-image-link"], {
          value: {
            _meta: {
              schema:
                "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
            },
            id: "2bfd10cd-d3df-4d57-b6ae-40609a357033",
            name: "How-To-Pack-Your-Suitcase",
            endpoint: "willow",
            defaultHost: "i1.adis.ws",
            "@id":
              "http://image.cms.amplience.com/2bfd10cd-d3df-4d57-b6ae-40609a357033",
            mediaType: "image"
          }
        })
      );

      menu.insertMenu.content.push(
        createBlockMenu("Insert Broken Image", schema.nodes["dc-image-link"], {
          value: {
            _meta: {
              schema:
                "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
            },
            id: "2bfd10cd-d3df-4d57-b6ae-40609a357033",
            name: "How-To-Pack-Your-Suitcase",
            endpoint: "broken",
            defaultHost: "invalid-host",
            "@id":
              "http://image.cms.amplience.com/2bfd10cd-d3df-4d57-b6ae-40609a357033",
            mediaType: "image"
          }
        })
      );

      menu.insertMenu.content.push(
        createBlockMenu("Insert Invalid Image", schema.nodes["dc-image-link"], {
          value: {}
        })
      );
      return menu;
    },

    modifyOptions: (options: any) => {
      return {
        ...options,
        nodeViews: {
          "dc-image-link": (node: any, view: any, getPos: any) =>
            new DcImageLinkView(node, view, getPos, {
              dynamicContent: {
                stagingEnvironment: "i1.adis.ws"
              }
            })
        }
      };
    }
  });
  return container;
});
