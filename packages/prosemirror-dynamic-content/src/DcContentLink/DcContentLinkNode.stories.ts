import { storiesOf } from "@storybook/html";

import "../../style/style.css";
import { createBlockMenu, createEditor } from "../utils/prosemirror";
import { DcContentLinkNode } from "./DcContentLinkNode";
import { DcContentLinkView } from "./DcContentLinkView";

// tslint:disable-next-line
const { Schema } = require("prosemirror-model");

const editorSettings = {
  modifySchema: (schema: any) => {
    return new Schema({
      marks: schema.schema.spec.marks,
      nodes: schema.schema.spec.nodes.addBefore(
        "image",
        "dc-content-link",
        DcContentLinkNode()
      )
    });
  },

  modifyMenu: (menu: any, schema: any) => {
    menu.insertMenu.content.push(
      createBlockMenu("Insert Content Link", schema.nodes["dc-content-link"], {
        value: {
          _meta: {
            schema:
              "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
          },
          contentType:
            "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
          id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
        }
      })
    );
    return menu;
  }
};

storiesOf("DcContentLinkNode", module)
  .add("Default Icon", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {})
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  })

  .add("Custom Icon", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {
                tools: {
                  "dc-content-link": {
                    contentTypeSettings: [
                      {
                        id: "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                        icon: "https://bigcontent.io/cms/icons/ca-types-article.png"
                      }
                    ]
                  }
                }
              })
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  })

  .add("Card", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {
                dynamicContent: {
                  stagingEnvironment:
                    "8d0nfe8p86q314k885enoody0.staging.bigcontent.io"
                },
                tools: {
                  "dc-content-link": {
                    contentTypeSettings: [
                      {
                        id: "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                        card: "https://d3rcavkmxce5gq.cloudfront.net/preview/card?vse={{vse.domain}}&content={{content.sys.id}}"
                      }
                    ]
                  }
                }
              })
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  })
  .add("Custom Aspect Ratio", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {
                dynamicContent: {
                  stagingEnvironment:
                    "8d0nfe8p86q314k885enoody0.staging.bigcontent.io"
                },
                tools: {
                  "dc-content-link": {
                    contentTypeSettings: [
                      {
                        id: "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                        card: "https://d3rcavkmxce5gq.cloudfront.net/preview/card?vse={{vse.domain}}&content={{content.sys.id}}",
                        aspectRatio: "1:1"
                      }
                    ]
                  }
                }
              })
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  })
  .add("Custom Icon (old)", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {
                tools: {
                  "dc-content-link": {
                    contentTypeSettings: {
                      cards: {},
                      icons: {
                        "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json":
                          "https://bigcontent.io/cms/icons/ca-types-article.png"
                      }
                    }
                  }
                }
              })
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  })

  .add("Card (old)", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {
                dynamicContent: {
                  stagingEnvironment:
                    "8d0nfe8p86q314k885enoody0.staging.bigcontent.io"
                },
                tools: {
                  "dc-content-link": {
                    contentTypeSettings: {
                      cards: {
                        "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json":
                          "https://d3rcavkmxce5gq.cloudfront.net/preview/card?vse={{vse.domain}}&content={{content.sys.id}}"
                      },
                      icons: {}
                    }
                  }
                }
              })
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  })
  .add("Custom Aspect Ratio (old)", () => {
    const { container } = createEditor({
      ...editorSettings,

      modifyOptions: (options: any) => {
        return {
          ...options,
          nodeViews: {
            "dc-content-link": (node: any, view: any, getPos: any) =>
              new DcContentLinkView(node, view, getPos, {
                dynamicContent: {
                  stagingEnvironment:
                    "8d0nfe8p86q314k885enoody0.staging.bigcontent.io"
                },
                tools: {
                  "dc-content-link": {
                    contentTypeSettings: {
                      cards: {
                        "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json":
                          "https://d3rcavkmxce5gq.cloudfront.net/preview/card?vse={{vse.domain}}&content={{content.sys.id}}"
                      },
                      icons: {},
                      aspectRatios: {
                        "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json":
                          "1:1"
                      }
                    }
                  }
                }
              })
          }
        };
      },

      doc: {
        type: "doc",
        content: [
          {
            type: "dc-content-link",
            attrs: {
              value: {
                _meta: {
                  schema:
                    "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
                },
                contentType:
                  "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
                id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
              }
            }
          }
        ]
      }
    });
    return container;
  });

