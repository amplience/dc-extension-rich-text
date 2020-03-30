import React from "react";

import { SDK } from "dc-extensions-sdk";
import { SdkContext, withTheme } from "unofficial-dynamic-content-ui";
import EditorRichTextField from "./EditorRichTextField/EditorRichTextField";
import { RichTextDialogsContainer } from "./RichTextDialogs";

interface AppState {
  connected: boolean;
  sdk?: SDK;
  value?: string;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = { connected: false };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleChooseLink = this.handleChooseLink.bind(this);
  }

  public componentDidMount(): void {
    this.handleConnect();
  }

  public async handleConnect(): Promise<void> {
    // See index.html for sdk init. 
    // Doing it there avoids DC timing us out for taking too long to respond, if this bundle takes too long to load.
    // tslint:disable-next-line: no-string-literal
    const sdk = await ((window as any).extensionsSdkInstance as Promise<SDK>);
    sdk.frame.startAutoResizer();

    const value: any = await sdk.field.getValue();
    this.setState({
      sdk,
      connected: true,
      value
    });
  }

  public handleValueChange(value: any): void {
    if (this.state.connected && this.state.sdk) {
      this.state.sdk.field.setValue(value);
    }
  }

  public async handleChooseLink(): Promise<{ href: string; title: string }> {
    return { href: "", title: "" };
  }

  public render(): React.ReactElement {
    const { connected, value, sdk } = this.state;

    return (
      <div className="App">
        {connected && sdk ? (
          <div>
            {
              withTheme(
                <SdkContext.Provider value={{ sdk }}>
                <RichTextDialogsContainer>
                  <EditorRichTextField onChange={this.handleValueChange} value={value} schema={sdk.field.schema} />
                </RichTextDialogsContainer>
              </SdkContext.Provider>
              )
            }
          </div>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
    );
  }
}
