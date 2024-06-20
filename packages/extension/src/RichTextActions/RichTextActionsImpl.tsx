import { datadogRum } from "@datadog/browser-rum";
import {
  Alert,
  RichTextActions,
  RichTextEditorContextProps,
} from "@dc-extension-rich-text/common";
import { MarkdownLanguage } from "@dc-extension-rich-text/language-markdown";
import { Assistant as AssistantIcon } from "@material-ui/icons";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import React from "react";
import { AIConfiguration } from "../AIPromptDialog";
import { track } from "../gainsight";
import { AmplienceContentStudio } from '@amplience/content-studio-sdk';

interface ChatModel {
  name: string;
  version: string;
  maxTokens: number;
}

const CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const CHAT_ESTIMATED_CHARS_PER_TOKEN = 4;
const CHAT_MODELS: ChatModel[] = [
  {
    name: "gpt-3.5-turbo",
    version: "gpt-3.5",
    maxTokens: 4096,
  },
  {
    name: "gpt-3.5-turbo-16k",
    version: "gpt-3.5",
    maxTokens: 16384,
  },
  {
    name: "gpt-4",
    version: "gpt-4",
    maxTokens: 8192,
  },
  {
    name: "gpt-4-32k",
    version: "gpt-4",
    maxTokens: 32768,
  },
];
const DIALOG_PREFIX = "[DIALOG]";

function getSuitableModel(
  desiredModelName: string,
  estimatedConsumedTokens: number
): string {
  const desiredModel = CHAT_MODELS.find((x) => x.name === desiredModelName);

  if (desiredModel && estimatedConsumedTokens > desiredModel.maxTokens) {
    const rightSizeModel = CHAT_MODELS.find(
      (x) =>
        x.version === desiredModel.version &&
        x.maxTokens > estimatedConsumedTokens
    );
    return rightSizeModel?.name || desiredModelName;
  } else {
    return desiredModelName;
  }
}

function getDelta(usesKey: any, data: string) {
  const payload = JSON.parse(data);
  if (usesKey) {
    return payload?.choices?.[0]?.delta?.content;
  }
  return payload?.content;
}

async function getCompletionUrl(
  sdk: any,
  hub: any,
  configuration: AIConfiguration,
  prompts: any
): Promise<string> {
  const hasKey = configuration.getKey();
  const convertRolesToUppercase = ({ role, content }: any) => ({
    role: role.toUpperCase(),
    content,
  });

  if (hasKey) {
    return CHAT_COMPLETIONS_URL;
  }

  const { data } = await sdk.connection.request(
    "dc-management-sdk-js:graphql-mutation",
    {
      mutation: `mutation generateRichText($orgId: ID!, $prompts:[RichTextGenerationPrompt!]!) {
        generateRichText(
          input: {
           organizationId: $orgId,
           prompts: $prompts
         }
        ) {
          url
        }
      }`,
      vars: {
        orgId: btoa(`Organization:${hub.organizationId}`),
        prompts: prompts.map(convertRolesToUppercase),
      },
    }
  );

  return data.generateRichText.url;
}

async function invokeChatCompletions(
  sdk: any,
  hub: any,
  configuration: AIConfiguration,
  body: any,
  onMessage: (buffer: string, complete: boolean) => void,
  onError: (error: any) => void
): Promise<void> {
  const maxOutputTokens = 2048;
  const estimatedInputTokens =
    body.messages
      .map((x: any) => x.content.length)
      .reduce((partialSum: number, a: number) => partialSum + a, 0) /
    CHAT_ESTIMATED_CHARS_PER_TOKEN;
  const estimatedConsumedTokens = maxOutputTokens + estimatedInputTokens;
  let markdownBuffer = "";
  try {
    const completionUrl = await getCompletionUrl(
      sdk,
      hub,
      configuration,
      body.messages
    );
    const key = configuration.getKey();
    const headers = {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    };

    await fetchEventSource(completionUrl, {
      headers,
      method: key ? "POST" : "GET",
      ...(key
        ? {
            body: JSON.stringify({
              model: getSuitableModel(
                configuration.getModel(),
                estimatedConsumedTokens
              ),
              max_tokens: maxOutputTokens,
              stream: true,
              ...body,
            }),
          }
        : {}),
      onmessage: (e) => {
        try {
          if (e.data === "[DONE]" || e?.event === "end") {
            onMessage(markdownBuffer, true);
            return;
          }

          const delta = getDelta(key, e.data);
          if (delta !== undefined) {
            markdownBuffer += delta;
            onMessage(markdownBuffer, false);
          }
        } catch (err) {}
      },
      async onopen(response): Promise<void> {
        if (key) {
          track(window, "AI Own OpenAI used", {
            name: "dc-extension-rich-text",
            category: "Extension",
          });
        } else {
          track(window, "AI Credits used", {
            name: "dc-extension-rich-text",
            category: "Extension",
          });
        }
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
      },
    });
  } catch (e) {
    return onError(e);
  }
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
${prompt}`;
  }

  public async rewriteSelectedContentUsingAI(
    prompt: string,
    keywords: string[]
  ): Promise<void> {
    try {
      datadogRum.addAction("rewriteSelectedContentUsingAI", { prompt });
    } catch (err) {}

    const { proseMirrorEditorView, language } = this.context || {};

    const { state } = proseMirrorEditorView;

    const from = state.selection.from;
    const to = state.selection.to;

    const content = state.doc.cut(from, to);

    const bodyMarkdown = (language as MarkdownLanguage).serializeMarkdown(
      state.doc
    );
    const selectionMarkdown = (language as MarkdownLanguage).serializeMarkdown(
      content
    );

    const sampleDocument = `# Say Cheese: The Ultimate Guide to Cheese

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

## Conclusion

Cheese is a delicious and versatile ingredient that can be enjoyed in a variety of ways. From its humble beginnings thousands of years ago to its place as one of the world's most popular dairy products, cheese has a special place in the hearts of people around the world. So, let's raise a glass of wine and say cheese!`;

    const sampleSelection = `You can melt it, slice it, crumble it, or grate it - whatever way you choose, cheese always adds an extra dimension to any dish.`;
    const sampleResponse = `You can melt, slice, crumble, or grate it - cheese enhances any dish.`;

    return this.handleInsertAIContent({
      messages: [
        {
          role: "system",
          content: `I want you to act as an editor for marketing copy.
  - You will receive the original markdown document, followed by a selection from the document that the user wants to change, followed by a description of the change you should make.
  - You should reply with a markdown formatted string that can replace the provided selection.

Do not produce more content than you were originally provided unless specifically requested. 
  - If the selection includes only a header, reply with only a header. 
  - If the selection includes only a bullet point, reply with only a bullet point. 
  - If the selection includes only one line, reply with only one line. 
  - If the user asks you to make the selection longer, you can expand on the provided selection, but do not produce any additional elements.
  - For example, if given a header, and asked to make it longer, you can add more text to the header, but you should not add any more lines.

If the user requests a change that you cannot produce a reasonable replacement for, you should respond with an error. 
  - Return errors sparingly, try to make a best effort attempt at handling the user's request whenever possible.
  - If you return an error, prefix it with \`[DIALOG]\`. 
  - For example, if the user provides the selection \`Banana\` and asks you to shorten it, you might reply: \`[DIALOG] I can't shorten "Banana" any further.\`.

Do not converse with the user. 
  - Do not ask clarifying questions. 
  - Do not add conversational preamble such as \`Sure, I can do that\`, or \`Ok, here's the change\`.
  
  ${
    keywords.length
      ? `Optimize the text for SEO following SEO best practices.
   - Include the following keywords: ${keywords.join(", ")}
   `
      : ""
  }`,
        },
        {
          role: "user",
          content: this.formatRewritePrompt(
            sampleDocument,
            sampleSelection,
            `Shorten this`
          ),
        },
        {
          role: "assistant",
          content: sampleResponse,
        },
        {
          role: "user",
          content: this.formatRewritePrompt(
            bodyMarkdown,
            selectionMarkdown,
            prompt
          ),
        },
      ],
    });
  }

  public async insertAIContent(
    prompt: string,
    keywords: string[]
  ): Promise<void> {
    try {
      datadogRum.addAction("insertAIContent", { prompt });
    } catch (err) {}

    return this.handleInsertAIContent({
      messages: [
        {
          role: "system",
          content: `I want you to act as a copywriter that produces markdown formatted content for marketing.
  - You will receive a prompt from the user.
  - You should reply with a markdown document that can be used in marketing materials.
  - Do not include hyperlinks in your response.
  - Do not include images in your response.

If the user's prompt asks for only a portion of a document, you should return only that portion.
  - If the user asks for only a title, produce only a title.
  - If the user asks for only a paragraph, produce only a paragraph.
  - If the user asks for only a bullet list, produce only a bullet list.

If the user provides a prompt that you cannot produce a document for, you should return an error.
  - Prefix any errors with [DIALOG].
  - For example, if the user's prompt is \`Hello?\`, then you might respond with \`[DIALOG] Please describe the content you want to generate.\`

Do not converse with the user.
  - Do not ask clarifying questions.
  - Do not add conversational preamble such as \`Sure, I can do that\`, or \`Ok, here's the change\`.
  - Do not include [DIALOG] if you've successfully produced a document.
  
  ${
    keywords.length
      ? `Optimize the text for SEO following SEO best practices.
   - Include the following keywords: ${keywords.join(", ")}
   `
      : ""
  }`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  }

  public async handleInsertAIContent(payload: any): Promise<void> {
    const {
      proseMirrorEditorView,
      setIsLocked,
      params,
      language,
    } = this.context!;
    const configuration = new AIConfiguration(params);

    const { dispatch } = proseMirrorEditorView;
    let { state } = proseMirrorEditorView;

    setIsLocked(true);

    let startPosition = state.selection?.from ?? state.doc.content.size;
    let endPosition = state.selection?.to || startPosition;

    const resolved = state.doc.resolve(startPosition, endPosition);
    const isEmptyParagraph =
      resolved?.parent?.type?.name === "paragraph" &&
      resolved?.parent?.content?.size === 0;

    if (isEmptyParagraph) {
      startPosition--;
    }

    let alert: Alert | undefined;

    this.context!.setShowCreditsError(false);

    try {
      await invokeChatCompletions(
        this.context?.sdk as any,
        this.context?.hub as any,
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
                title: "AI Assistant",
                icon: <AssistantIcon />,
                severity: "info",
                content,
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

          let fragment = (language as MarkdownLanguage).parseMarkdown(
            buffer.trim()
          ).content;

          if (fragment.content.length === 1) {
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
        (err) => {
          if (
            err?.data?.errors?.[0]?.extensions?.code === "INSUFFICIENT_CREDITS"
          ) {
            track(window, "AI Credits Limit reached", {
              name: "dc-extension-rich-text",
              category: "Extension",
            });
            this.context!.setShowCreditsError(true);
          }
          if (err?.error?.message) {
            this.context!.dialogs.alert({
              title: "AI Assistant",
              icon: <AssistantIcon />,
              severity: "error",
              content: err?.error?.message,
            });
          }
        }
      );
    } catch {}

    this.context?.setIsLocked(false);
  }

  public async insertContentStudioContent(): Promise<void> {
    try {
      const { proseMirrorEditorView, params, language } = this.context!;
      const { dispatch } = proseMirrorEditorView;
      let { state } = proseMirrorEditorView;

      const studio = new AmplienceContentStudio({
        baseUrl:
          params?.tools?.contentStudio?.baseUrl ||
          "https://app.amplience.net/content-studio",
      });

      const { content } = await studio.getContent();
      const textFields = Object.values(content)
        .filter((x) => typeof x === "string") as string[];

      if (textFields.length > 0) {
        let fragment = (language as MarkdownLanguage).parseMarkdown(
          textFields[0].trim()
        ).content;

        if (fragment.content.length === 1) {
          fragment = fragment.content[0].content;
        }

        let startPosition = state.selection?.from ?? state.doc.content.size;
        let endPosition = state.selection?.to || startPosition;

        const transaction = state.tr.replaceWith(
          startPosition,
          endPosition,
          fragment
        );

        dispatch(transaction);
      }
    } catch (err) {}
  }
}
