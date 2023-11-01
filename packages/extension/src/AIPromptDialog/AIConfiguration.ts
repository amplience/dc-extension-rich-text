const OPENAI_CHATGPT_DEFAULT_MODEL = "gpt-3.5-turbo";

const DEFAULT_EDIT_PROMPTS = [
  {
    label: "Improve text",
    prompt: "Improve this",
  },
  {
    label: "Shorten",
    prompt: "Shorten this",
  },
  {
    label: "Make longer",
    prompt: "Expand this",
  },
];

export interface AIEditPrompt {
  label: string;
  prompt: string;
}

export class AIConfiguration {
  private params: any;

  constructor(params: any) {
    this.params = params;
  }

  public getKey(): string | undefined {
    return this.params?.tools?.ai?.key;
  }

  public getModel(): string {
    return this.params?.tools?.ai?.model || OPENAI_CHATGPT_DEFAULT_MODEL;
  }

  public getEditPrompts(): AIEditPrompt[] {
    return this.params?.tools?.ai?.editPrompts || DEFAULT_EDIT_PROMPTS;
  }
}
