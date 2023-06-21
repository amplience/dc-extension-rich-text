import { createMarkdownParser } from '@dc-extension-rich-text/language-markdown';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { RichTextEditorContextProps, GenerateContentPrompt, RichTextActions } from '@dc-extension-rich-text/common';

const CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const TEXT_DECODER = new TextDecoder('utf-8');

export class RichTextActionsImpl implements RichTextActions {
    private context: RichTextEditorContextProps | undefined;

    setRichTextEditorContext(context: RichTextEditorContextProps) {
        this.context = context;
    }

    async insertGeneratedContent(state: any, dispatch: any, prompt: GenerateContentPrompt): Promise<void> {
        const apiKey = process.env.OPENAI_KEY;

        this.context && this.context.setIsLocked(true);

        const markdownParser = createMarkdownParser(state.schema, {});
        const startPosition = state.doc.content.size;
        let markdownBuffer = '';

        const updateTextOutput = () => {
            const fragment = markdownParser.parse(markdownBuffer).content;
            const newState = dispatch(
                state.tr.replaceWith(startPosition, state.doc.content.size, fragment)
            );
            state = newState;
        };

        await fetchEventSource(CHAT_COMPLETIONS_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'I want you to act as a copywriter that produces markdown formatted content in response to a user\'s prompts. Do not converse with the user.'
                    },
                    {
                        role: 'user',
                        content: prompt.prompt
                    }
                ],
                max_tokens: 2048,
                stream: true
            }),
            onmessage: (e) => {
                if (e.data === '[DONE]') {
                    this.context && this.context.setIsLocked(false);
                    return;
                }
                try { 
                    const payload = JSON.parse(e.data);
                    const delta = payload.choices[0].delta.content;
                    if (delta !== undefined) {
                        markdownBuffer += delta;
                        updateTextOutput();
                    }
                } catch (err) {
                    //console.log(err);
                }
            }
        });
    }
}