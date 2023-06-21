import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  RichTextEditorContextProps,
  GenerateContentPrompt,
  RichTextActions,
} from "@dc-extension-rich-text/common";

const CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const TEXT_DECODER = new TextDecoder("utf-8");

async function invokeChatCompletions(
  body: any,
  onMessage: (buffer: string) => void
) {
  const apiKey = process.env.OPENAI_KEY;
  let markdownBuffer = "";
  await fetchEventSource(CHAT_COMPLETIONS_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      stream: true,
      ...body,
    }),
    onmessage: (e) => {
      try {
        const payload = JSON.parse(e.data);
        const delta = payload.choices[0].delta.content;
        if (delta !== undefined) {
          markdownBuffer += delta;
          onMessage(markdownBuffer);
        }
      } catch (err) {}
    },
  });
}

export class RichTextActionsImpl implements RichTextActions {
  private context: RichTextEditorContextProps | undefined;

  setRichTextEditorContext(context: RichTextEditorContextProps) {
    this.context = context;
  }

  formatRewritePrompt(body: string, selection: string, prompt: string): string {
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

  async rewriteSelectedContentUsingGenerativeAI(
    from: number,
    to: number,
    prompt: string
  ): Promise<void> {
    const { proseMirrorEditorView, languages = {} } = this.context || {};

    let { state } = proseMirrorEditorView;

    const content = state.doc.cut(from, to);
    const markdownLanguage = languages["markdown"].language;

    const bodyMarkdown = markdownLanguage.serialize(state.doc);
    const selectionMarkdown = markdownLanguage.serialize(content);

    let lastSelectionStart = from;
    let lastSelectionTo = to;

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

    await invokeChatCompletions(
      {
        messages: [
          {
            role: "system",
            content:
              "I want you to act as a copywriter that makes edits to markdown formatted content provided by a user. You will receive the original markdown document, followed by a selection from the document that the user wants to change, followed by a description of the change you should make. You should reply with a markdown formatted string that can replace the provided selection. Do not converse with the user. Do not provide an entire changed document.",
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
      },
      (buffer) => {
        let fragment = markdownLanguage.parse(buffer).content;
        if (fragment.content.length === 1) {
          //TODO: probably just a paragraph, so we need to unwrap it
          fragment = fragment.content[0].content;
        }
        const newState = proseMirrorEditorView.dispatch(
          state.tr.replaceWith(lastSelectionStart, lastSelectionTo, fragment)
        );
        state = newState;
        lastSelectionTo = lastSelectionStart + fragment.size;
      }
    );
  }

  async insertGeneratedContent(
    state: any,
    dispatch: any,
    prompt: GenerateContentPrompt
  ): Promise<void> {
    this.context && this.context.setIsLocked(true);

    const { languages = {} } = this.context || {};

    const markdownLanguage = languages["markdown"].language;
    const startPosition = state.doc.content.size;

    await invokeChatCompletions(
      {
        messages: [
          {
            role: "system",
            content:
              "I want you to act as a copywriter that produces markdown formatted content in response to a user's prompts. Do not converse with the user.",
          },
          {
            role: "user",
            content: prompt.prompt,
          },
        ],
      },
      (buffer) => {
        const fragment = markdownLanguage.parse(buffer).content;
        const newState = dispatch(
          state.tr.replaceWith(startPosition, state.doc.content.size, fragment)
        );
        state = newState;
      }
    );

    this.context?.setIsLocked(false);
  }
}
