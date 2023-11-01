import React from "react";

import { datadogRum } from "@datadog/browser-rum";
import { ThemeProvider } from "@material-ui/core/styles";
import { init, SDK } from "dc-extensions-sdk";
import { SdkContext, withTheme } from "unofficial-dynamic-content-ui";
import EditorRichTextField from "./EditorRichTextField/EditorRichTextField";
import { RichTextDialogsContainer } from "./RichTextDialogs";
import theme from "./theme";
import HubContext from "./HubContext/HubContext";

interface AppState {
  connected: boolean;
  sdk?: SDK;
  hub?: any;
  value?: string;
  params?: any;
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
    this.handleInitRum();
  }

  public handleInitRum(): void {
    const ddToken = process.env.REACT_APP_DATADOG_TOKEN;
    const ddAppId = process.env.REACT_APP_DATADOG_APP_ID;
    const ddEnv = process.env.REACT_APP_DATADOG_ENV_ID;

    if (ddToken && ddAppId && ddEnv) {
      datadogRum.init({
        applicationId: ddAppId,
        clientToken: ddToken,
        env: ddEnv,
        site: "datadoghq.com",
        service: "dc-extension-rich-text",
        version: "0.1.0",
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        defaultPrivacyLevel: "allow",
        sampleRate: 100,
        useCrossSiteSessionCookie: true,
        proxy: "https://dd-proxy.amplience.net",
      });

      datadogRum.startSessionReplayRecording();
    }
  }

  public async handleConnect(): Promise<void> {
    const sdk = await init();
    sdk.frame.startAutoResizer();

    sdk.contentItem
      .getCurrent()
      .then((item) => {
        datadogRum.setGlobalContext({
          deliveryId: item.deliveryId,
        });
      })
      .catch(() => {});

    const hub = await sdk.connection
      .request("context-get")
      .then(({ hub }) => hub)
      .catch(() => ({}));

    const params = {
      ...sdk.field?.schema?.["ui:extension"]?.params,
      ...sdk.params?.installation,
      ...sdk.params?.instance,
    };

    const value: any = await sdk.field.getValue();
    this.setState({
      sdk,
      connected: true,
      value,
      params,
      hub,
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
    const { connected, value, sdk, hub } = this.state;

    return (
      <div className="App">
        {connected && sdk ? (
          <div>
            {withTheme(
              <ThemeProvider theme={theme}>
                <SdkContext.Provider value={{ sdk }}>
                  <HubContext.Provider value={{ hub }}>
                    <RichTextDialogsContainer params={this.state.params}>
                      <EditorRichTextField
                        onChange={this.handleValueChange}
                        value={value}
                        schema={sdk.field.schema}
                      />
                    </RichTextDialogsContainer>
                  </HubContext.Provider>
                </SdkContext.Provider>
              </ThemeProvider>
            )}
          </div>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
    );
  }
}
