import { datadogRum } from "@datadog/browser-rum";
import {
  Alert,
  OpenAIMark,
  RichTextActions,
  RichTextEditorContextProps
} from "@dc-extension-rich-text/common";
import { Assistant as AssistantIcon } from "@material-ui/icons";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import React from "react";
import { AIConfiguration } from "../AIPromptDialog";

const CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const DIALOG_PREFIX = "[DIALOG]";

async function invokeChatCompletions(
  configuration: AIConfiguration,
  body: any,
  onMessage: (buffer: string, complete: boolean) => void,
  onError: (error: any) => void
): Promise<void> {
  let markdownBuffer = "";
  await fetchEventSource(CHAT_COMPLETIONS_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${configuration.getKey()}`
    },
    method: "POST",
    body: JSON.stringify({
      model: configuration.getModel(),
      max_tokens: 2048,
      stream: true,
      ...body
    }),
    onmessage: e => {
      try {
        if (e.data === "[DONE]") {
          onMessage(markdownBuffer, true);
          return;
        }
        const payload = JSON.parse(e.data);
        const delta = payload.choices[0].delta.content;
        if (delta !== undefined) {
          markdownBuffer += delta;
          onMessage(markdownBuffer, false);
        }
      } catch (err) {}
    },
    async onopen(response): Promise<void> {
      const contentType = response.headers.get("content-type");
      if (contentType?.startsWith("application/json")) {
        onError(await response.json());
        return;
      }
      if (
        !(contentType === null || contentType.startsWith("text/event-stream"))
      ) {
        throw new Error(
          `Expected content-type to be 'text/event-stream', Actual: ${contentType}`
        );
      }
    },
    onerror(err): void {
      throw err;
    }
  });
}

export class RichTextActionsImpl implements RichTextActions {
  private context: RichTextEditorContextProps | undefined;

  public setRichTextEditorContext(context: RichTextEditorContextProps): void {
    this.context = context;
  }

  public formatRewritePrompt(
    body: string,
    selection: string,
    prompt: string
  ): string {
    return `This is the original content I am starting with: 
        ---
        ${body}
        ---
        This is the selection I want to update:
        ---
        ${selection}
        ---
        This is the description of the change I want to make:
        ---
        ${prompt}
        `;
  }

  public async rewriteSelectedContentUsingAI(prompt: string): Promise<void> {
    try {
      datadogRum.addAction("rewriteSelectedContentUsingAI", { prompt });
    } catch (err) {}

    const { proseMirrorEditorView, languages = {} } = this.context || {};

    const { state } = proseMirrorEditorView;

    const from = state.selection.from;
    const to = state.selection.to;

    const content = state.doc.cut(from, to);
    const markdownLanguage = languages.markdown.language;

    const bodyMarkdown = markdownLanguage.serialize(state.doc);
    const selectionMarkdown = markdownLanguage.serialize(content);

    const sampleDocument = `
        # Say Cheese: The Ultimate Guide to Cheese

        Cheese, the dairy product that has a special place in everyone's hearts, is a versatile ingredient that has been enjoyed for thousands of years across the globe. You can melt it, slice it, crumble it, or grate it - whatever way you choose, cheese always adds an extra dimension to any dish. In this ultimate guide to cheese, you'll learn everything you need to know about the world's favorite dairy product.
        
        ## History of Cheese
        
        The origin of cheese can be traced back to ancient times. Even before recorded history, it is believed that the process of cheesemaking was discovered accidentally by storing milk in animal bladders or stomachs, causing it to curdle and form cheese. Cheese quickly became a staple in the diets of people around the world and is now enjoyed in cultures all across the globe.
        
        ## Types of Cheese
        
        There are thousands of different types of cheese, each with its own flavor, texture, and aroma. From mild and creamy Brie to sharp and nutty Cheddar, there is a cheese for every taste preference. Some popular varieties of cheese include:
        
        * Cheddar
        
        * Brie
        
        * Mozzarella
        
        * Parmesan
        
        * Feta
        
        * Blue Cheese
        
        * Gouda
        
        * Swiss
        
        ## How to Enjoy Cheese
        
        Cheese can be enjoyed in a variety of ways, from simply snacking on it to cooking with it. Here are some delicious ways to enjoy cheese:
        
        * Add cheese to a charcuterie board with crackers and meats
        
        * Serve melted cheese over nachos or fries
        
        * Make a gourmet grilled cheese sandwich
        
        * Add cheese to pasta dishes such as mac and cheese or lasagna
        
        * Use cheese as a pizza topping
        
        * Enjoy with a glass of wine or beer
        
        ## How to Store Cheese
        
        To keep your cheese fresh and delicious for as long as possible, it's essential to store it properly. Soft and semi-soft cheeses such as Brie and Camembert should be wrapped in wax paper or plastic wrap and stored in the fridge. Hard cheeses like Cheddar and Parmesan can be stored in the fridge in a sealed container or in their original wrapping.
        
        ## Conclusion
        
        Cheese is a delicious and versatile ingredient that can be enjoyed in a variety of ways. From its humble beginnings thousands of years ago to its place as one of the world's most popular dairy products, cheese has a special place in the hearts of people around the world. So, let's raise a glass of wine and say cheese!
        `;

    const sampleSelection = `You can melt it, slice it, crumble it, or grate it - whatever way you choose, cheese always adds an extra dimension to any dish.`;
    const sampleResponse = `You can melt, slice, crumble, or grate it - cheese enhances any dish.`;

    return this.handleInsertAIContent({
      messages: [
        {
          role: "system",
          content:
            'I want you to act as a copywriter that makes edits to markdown formatted content provided by a user. You will receive the original markdown document, followed by a selection from the document that the user wants to change, followed by a description of the change you should make. You should reply with a markdown formatted string that can replace the provided selection. Do not converse with the user. Only rewrite the selected content not the entire document. If you return an error, prefix it with "' +
            DIALOG_PREFIX +
            '"'
        },
        {
          role: "user",
          content: this.formatRewritePrompt(
            sampleDocument,
            sampleSelection,
            `Shorten this`
          )
        },
        {
          role: "assistant",
          content: sampleResponse
        },
        {
          role: "user",
          content: this.formatRewritePrompt(
            bodyMarkdown,
            selectionMarkdown,
            prompt
          )
        }
      ]
    });
  }

  public async insertAIContent(prompt: string): Promise<void> {
    try {
      datadogRum.addAction("insertAIContent", { prompt });
    } catch (err) {}

    return this.handleInsertAIContent({
      messages: [
        {
          role: "system",
          content:
            "I want you to act as a copywriter that produces markdown formatted content in response to a user's prompts. Do not converse with the user."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });
  }

  public async handleInsertAIContent(payload: any): Promise<void> {
    const { proseMirrorEditorView, setIsLocked, params } = this.context!;
    const configuration = new AIConfiguration(params);

    const { dispatch } = proseMirrorEditorView;
    let { state } = proseMirrorEditorView;

    setIsLocked(true);

    const { languages = {} } = this.context || {};
    const markdownLanguage = languages.markdown.language;

    const startPosition = state.selection?.from ?? state.doc.content.size;
    let endPosition = state.selection?.to || startPosition;

    let alert: Alert | undefined;

    try {
      await invokeChatCompletions(
        configuration,
        payload,
        (buffer, complete) => {
          const isEmpty = buffer.length === 0;
          const isDialog = buffer.startsWith(DIALOG_PREFIX);
          const couldBeDialog =
            !complete &&
            buffer.length < DIALOG_PREFIX.length &&
            buffer === DIALOG_PREFIX.slice(0, buffer.length);

          if (isDialog) {
            const content = buffer.slice(DIALOG_PREFIX.length);
            if (!alert) {
              alert = this.context!.dialogs.alert({
                title: "ChatGPT",
                icon: <AssistantIcon />,
                severity: "info",
                content
              });
            } else {
              alert.updateContent(content);
            }
            setIsLocked(false);
            return;
          }

          if (isEmpty || couldBeDialog) {
            return;
          }

          let fragment = markdownLanguage.parse(buffer.trim()).content;
          if (
            fragment.content.length === 1 &&
            fragment.content[0].type.name === "paragraph"
          ) {
            fragment = fragment.content[0].content;
          }
          const transaction = state.tr.replaceWith(
            startPosition,
            endPosition,
            fragment
          );
          const newState = dispatch(transaction);
          state = newState;
          endPosition = Math.max(
            state.selection?.to,
            startPosition + fragment.size
          );
        },
        err => {
          if (err?.error?.message) {
            this.context!.dialogs.alert({
              title: "ChatGPT",
              icon: <AssistantIcon />,
              severity: "error",
              content: err?.error?.message
            });
          }
        }
      );
    } catch {}

    this.context?.setIsLocked(false);
  }
}
