import { storiesOf } from "@storybook/react";
import { SDK } from "dc-extensions-sdk";
import React from "react";
import { SdkContext, withTheme } from "unofficial-dynamic-content-ui";
import { RichTextDialogsContainer } from "../RichTextDialogs";
import EditorRichTextField from "./EditorRichTextField";

const imageValue = {
  _meta: {
    schema: "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
  },
  id: "c2f2bed1-4ba7-4457-ae4d-85930e333b3a",
  name: "sap_cx_live_munich_home_1920x550_munich",
  endpoint: "willow",
  defaultHost: "i1.adis.ws"
};

const mockSdk = new SDK();
mockSdk.stagingEnvironment = "8d0nfe8p86q314k885enoody0.staging.bigcontent.io";
mockSdk.mediaLink.getImage = () => {
  return Promise.resolve(imageValue);
};
mockSdk.contentLink.get = () => {
  return Promise.resolve({
    _meta: {
      schema:
        "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link"
    },
    contentType:
      "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json",
    id: "c6f77ffc-9d70-45e9-b322-89d4436b8774"
  });
};

storiesOf("EditorRichTextField", module)
  .add("Default Component", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField schema={{}} />
      </RichTextDialogsContainer>
    );
  })
  .add("Markdown", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                language: "markdown"
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("JSON", () => {
    return withTheme(
      <SdkContext.Provider value={{ sdk: mockSdk }}>
        <RichTextDialogsContainer>
          <EditorRichTextField
            schema={{
              "ui:extension": {
                params: {
                  language: "json"
                }
              }
            }}
          />
        </RichTextDialogsContainer>
      </SdkContext.Provider>
    );
  })
  .add("Title", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                title: "Rich Text Title"
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Content Links", () => {
    return withTheme(
      <SdkContext.Provider value={{ sdk: mockSdk }}>
        <RichTextDialogsContainer>
          <EditorRichTextField
            schema={{
              "ui:extension": {
                params: {
                  language: "json",

                  tools: {
                    "dc-content-link": {
                      contentTypes: [
                        "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json"
                      ],
                      contentTypeSettings: {
                        cards: {
                          "https://raw.githubusercontent.com/neilmistryamplience/dc-example-website/willow/content-types/card.json":
                            "https://d3rcavkmxce5gq.cloudfront.net/preview/card?vse={{vse.domain}}&content={{content.sys.id}}"
                        },
                        icons: {}
                      }
                    }
                  }
                }
              }
            }}
          />
        </RichTextDialogsContainer>
      </SdkContext.Provider>
    );
  })
  .add("Custom Styles", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                styles: `
                                p, h1, h2, h3, h4, h5, h6, h7 {
                                    color: red;
                                }
                            `
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Custom Stylesheet", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                stylesheet:
                  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Custom Inline Styles", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                styles: `
                                .red {
                                    color: red;
                                    text-decoration: line-through;
                                }

                                .green {
                                    color: green;
                                }
                        `,
                tools: {
                  blacklist: [],
                  inline_styles: {
                    classNames: [
                      { className: "red", label: "Was Price" },
                      { className: "green", label: "Promotion" }
                    ]
                  }
                },
                toolbar: {
                  layout: [
                    {
                      type: "dropdown",
                      label: "Styles",
                      toolNames: [
                        "inline_styles_className_red",
                        "inline_styles_className_green"
                      ]
                    },
                    {
                      type: "button",
                      toolName: "clear_formatting"
                    }
                  ]
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Custom Toolbar Layout", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                toolbar: {
                  layout: [
                    { type: "button", toolName: "strong" },
                    { type: "button", toolName: "em" }
                  ]
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Disable Toolbar", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                toolbar: {
                  disabled: true
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Read Only Code View", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                codeView: {
                  readOnly: true
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Disable Code View", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                codeView: {
                  disabled: true
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })

  .add("Read Only Edit View", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                editView: {
                  readOnly: true
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Blacklist Tool", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                tools: {
                  blacklist: ["strong"]
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Whitelist Tool", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                tools: {
                  whitelist: ["strong"]
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  })
  .add("Use Classes for Alignment", () => {
    return withTheme(
      <RichTextDialogsContainer>
        <EditorRichTextField
          schema={{
            "ui:extension": {
              params: {
                language: "json",
                useClasses: true,
                classOverride: {
                  "amp-align-left": "custom-align-left",
                  "amp-align-justify": "custom-align-justify",
                  "amp-align-right": "custom-align-right",
                  "amp-align-center": "custom-align-center"
                }
              }
            }
          }}
        />
      </RichTextDialogsContainer>
    );
  });
