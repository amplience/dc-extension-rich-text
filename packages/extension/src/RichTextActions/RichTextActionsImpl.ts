import { fetchEventSource } from '@microsoft/fetch-event-source';
import { RichTextEditorContextProps, GenerateContentPrompt, RichTextActions } from '@dc-extension-rich-text/common';

const CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const TEXT_DECODER = new TextDecoder('utf-8');

async function invokeChatCompletions(body: any, onMessage: (buffer: string) => void) {
    const apiKey = process.env.OPENAI_KEY;
    let markdownBuffer = '';
    await fetchEventSource(CHAT_COMPLETIONS_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        method: 'POST',
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            max_tokens: 2048,
            stream: true,
            ...body
        }),
        onmessage: (e) => {
            try { 
                const payload = JSON.parse(e.data);
                const delta = payload.choices[0].delta.content;
                if (delta !== undefined) {
                    markdownBuffer += delta;
                    onMessage(markdownBuffer);
                }
            } catch (err) {
            }
        }
    });
}

export class RichTextActionsImpl implements RichTextActions {
    private context: RichTextEditorContextProps | undefined;

    setRichTextEditorContext(context: RichTextEditorContextProps) {
        this.context = context;
    }

    async rewriteSelectedContentUsingGenerativeAI(prompt: string): Promise<void> {
        const {
            proseMirrorEditorView,
            languages = {}
        } = this.context || {};

        let {
            state
        } = proseMirrorEditorView;

        const content = state.doc.cut(state.selection.from, state.selection.to);
        const markdownLanguage = languages['markdown'].language;
        
        const bodyMarkdown = markdownLanguage.serialize(state.doc);
        const selectionMarkdown = markdownLanguage.serialize(content);

        let lastSelectionStart = state.selection.from;
        let lastSelectionTo = state.selection.to;

        await invokeChatCompletions({
            messages: [
                {
                    role: 'system',
                    content: 'I want you to act as a copywriter that makes edits to markdown formatted content provided by a user. You will receive the original markdown document, followed by a selection from the document that the user wants to change, followed by a description of the change you should make. You should reply with a markdown formatted string that can replace the provided selection. Do not converse with the user. Do not provide an entire changed document.'
                },
                {
                    role: 'user',
                    content: `This is the content I am starting with: 
                    
                    ${bodyMarkdown}"`
                },
                {
                    role: 'user',
                    content: `This is the content I want to update: 
                    
                    ${selectionMarkdown}`
                },
                {
                    role: 'user',
                    content: `This is the description of the change the user wants to make: 
                    
                    ${prompt}`
                }
            ]
        }, (buffer) => {
            console.log(buffer);
            const fragment = markdownLanguage.parse(buffer).content;
            const newState = proseMirrorEditorView.dispatch(
                state.tr.replaceWith(lastSelectionStart, lastSelectionTo, fragment)
            );
            state = newState;
            lastSelectionTo = lastSelectionStart + fragment.size;
        });
    }

    async insertGeneratedContent(state: any, dispatch: any, prompt: GenerateContentPrompt): Promise<void> {
        this.context && this.context.setIsLocked(true);

        const {
            languages = {}
        } = this.context || {};

        const markdownLanguage = languages['markdown'].language;
        const startPosition = state.doc.content.size;

        await invokeChatCompletions({
            messages: [
                {
                    role: 'system',
                    content: 'I want you to act as a copywriter that produces markdown formatted content in response to a user\'s prompts. Do not converse with the user.'
                },
                {
                    role: 'user',
                    content: prompt.prompt
                }
            ]
        }, (buffer) => {
            const fragment = markdownLanguage.parse(buffer).content;
            const newState = dispatch(
                state.tr.replaceWith(startPosition, state.doc.content.size, fragment)
            );
            state = newState;
        });

        this.context?.setIsLocked(false);
    }
}