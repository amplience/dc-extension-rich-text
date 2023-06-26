const OPENAI_API_KEY_LOCAL_STORAGE_KEY = "openai_key";
const OPENAI_CHATGPT_MODEL = "openai_chatgpt_model";
const OPENAI_CHATGPT_DEFAULT_MODEL = "gpt-3.5-turbo";

const DEFAULT_EDIT_PROMPTS = [
  {
    label: "Improve this",
    prompt: "Improve this"
  },
  {
    label: "Shorten this",
    prompt: "Shorten this"
  },
  {
    label: "Elaborate on this",
    prompt: "Elaborate on this"
  }
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
    return this.getUserDefinedKey() || this.getExtensionDefinedKey();
  }

  public setUserDefinedKey(value: string | undefined): void {
    if (value === undefined || value === null || value === "") {
      window.localStorage.removeItem(OPENAI_API_KEY_LOCAL_STORAGE_KEY);
    } else {
      window.localStorage.setItem(OPENAI_API_KEY_LOCAL_STORAGE_KEY, value);
    }
  }

  public getUserDefinedKey(): string | undefined {
    try {
      const key = window.localStorage.getItem(OPENAI_API_KEY_LOCAL_STORAGE_KEY);
      if (key && key !== "") {
        return key;
      } else {
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }

  public getExtensionDefinedKey(): string | undefined {
    return this.params?.tools?.ai?.api?.key;
  }

  public getModel(): string | undefined {
    return (
      this.getUserDefinedModel() ||
      this.getExtensionDefinedModel() ||
      OPENAI_CHATGPT_DEFAULT_MODEL
    );
  }

  public setUserDefinedModel(value: string | undefined): void {
    if (value === undefined || value === null || value === "") {
      window.localStorage.removeItem(OPENAI_CHATGPT_MODEL);
    } else {
      window.localStorage.setItem(OPENAI_CHATGPT_MODEL, value);
    }
  }

  public getUserDefinedModel(): string | undefined {
    try {
      const model = window.localStorage.getItem(OPENAI_CHATGPT_MODEL);
      if (model && model !== "") {
        return model;
      } else {
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }

  public getExtensionDefinedModel(): string | undefined {
    return this.params?.tools?.ai?.api?.model;
  }

  public getEditPrompts(): AIEditPrompt[] {
    return this.params?.tools?.ai?.editPrompts || DEFAULT_EDIT_PROMPTS;
  }

  public canSaveUserDefinedConfigurations(): boolean {
    try {
      window.localStorage.getItem(OPENAI_API_KEY_LOCAL_STORAGE_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }
}
