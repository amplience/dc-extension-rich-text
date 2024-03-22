import React, { PropsWithChildren } from "react";

import {
  AIPromptDialogOptions,
  Alert,
  AlertOptions,
  Anchor,
  Hyperlink,
  Image,
  RichTextDialogs,
} from "@dc-extension-rich-text/common";

import AnchorDialog from "../AnchorDialog/AnchorDialog";
import CodeDialog from "../CodeDialog/CodeDialog";
import HyperlinkDialog from "../HyperlinkDialog/HyperlinkDialog";
import ImageDialog from "../ImageDialog/ImageDialog";
import RichTextDialogsContext from "./RichTextDialogsContext";

import { Snackbar } from "@material-ui/core";
import { SdkContext } from "unofficial-dynamic-content-ui";
import { AIPromptDialog } from "../AIPromptDialog";
import RichTextAlert from "./RichTextAlert";

interface EditorDialogsProps extends PropsWithChildren<{}> {
  params?: any;
}

interface OpenDialog {
  type: string;
  resolve: (value: any) => void;
  reject: () => void;
  value: any;
  options?: any;
}

let alertId = 0;

const RichTextDialogsContainer: React.SFC<EditorDialogsProps> = (
  props: EditorDialogsProps
) => {
  const { children, params } = props;

  const [openDialog, setOpenDialog] = React.useState<OpenDialog>();
  const [alerts, dispatchAlertEvent] = React.useReducer(
    (state: Alert[], action: any) => {
      switch (action.type) {
        case "ADD_ALERT":
          return [...state, action.alert];
        case "REMOVE_ALERT":
          const alertIndex = state.findIndex((x) => x.id === action.id);
          if (alertIndex !== -1) {
            state.splice(alertIndex, 1);
          }
          return [...state];
        case "UPDATE_ALERT_CONTENT":
          const alert = state.find((x) => x.id === action.id);
          if (alert) {
            alert.content = action.content;
          }
          return [...state];
      }
      return state;
    },
    []
  );

  const handleCloseDialog = React.useCallback(() => {
    if (openDialog) {
      openDialog.reject();
    }
    setOpenDialog(undefined);
  }, [openDialog, setOpenDialog]);

  const handleSubmitDialog = React.useCallback(
    (value: any) => {
      if (openDialog) {
        openDialog.resolve(value);
      }
      setOpenDialog(undefined);
    },
    [openDialog, setOpenDialog]
  );

  const handleOpenDialog = React.useCallback(
    (type: string, value?: any, options?: any) => {
      return new Promise((resolve, reject) => {
        setOpenDialog({
          type,
          resolve,
          reject,
          value,
          options,
        });
      });
    },
    [setOpenDialog]
  );

  const { sdk } = React.useContext(SdkContext);

  const handleUpdateAlertContent = React.useCallback(
    (id, content) => {
      dispatchAlertEvent({
        type: "UPDATE_ALERT_CONTENT",
        id,
        content,
      });
    },
    [dispatchAlertEvent]
  );

  const handleCloseAlert = React.useCallback(
    (id) => {
      dispatchAlertEvent({
        type: "REMOVE_ALERT",
        id,
      });
    },
    [dispatchAlertEvent]
  );

  const dialogs: RichTextDialogs = {
    getAnchor: (existing: Set<string>, value?: Anchor): Promise<Anchor> => {
      return handleOpenDialog("anchor", { value, existing }) as Promise<Anchor>;
    },
    getCode: (value?: string): Promise<string> => {
      return handleOpenDialog("code", value) as Promise<string>;
    },
    getHyperlink: (value?: Hyperlink): Promise<Hyperlink> => {
      return handleOpenDialog("hyperlink", value) as Promise<Hyperlink>;
    },
    getImage: (value?: Image): Promise<Image> => {
      return handleOpenDialog("image") as Promise<Image>;
    },
    getDcImageLink: (value?: any): Promise<any> => {
      if (!sdk) {
        return Promise.reject();
      } else {
        return sdk.mediaLink.getImage();
      }
    },
    getDcContentLink: (contentTypeIds: string[], value?: any): Promise<any> => {
      if (!sdk) {
        return Promise.reject();
      } else {
        return sdk.contentLink.get(contentTypeIds);
      }
    },
    getAIPrompt(
      dialogProps: AIPromptDialogOptions
    ): Promise<{ prompt: string; keywords: string[] }> {
      return handleOpenDialog("ai_prompt", undefined, dialogProps) as Promise<{
        prompt: string;
        keywords: string[];
      }>;
    },
    alert(alertProps: AlertOptions): Alert {
      const alert: any = {
        id: `${alertId++}`,
        ...alertProps,
      };
      alert.updateContent = (content: string | React.ReactElement) => {
        handleUpdateAlertContent(alert.id, content);
      };
      dispatchAlertEvent({
        type: "ADD_ALERT",
        alert,
      });
      return alert;
    },
  };

  return (
    <RichTextDialogsContext.Provider value={{ dialogs }}>
      {children}

      <AnchorDialog
        value={openDialog != null ? openDialog.value : undefined}
        open={openDialog != null && openDialog.type === "anchor"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
      />
      <CodeDialog
        value={openDialog != null ? openDialog.value : undefined}
        open={openDialog != null && openDialog.type === "code"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
      />
      <HyperlinkDialog
        value={openDialog != null ? openDialog.value : undefined}
        open={openDialog != null && openDialog.type === "hyperlink"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
      />
      <ImageDialog
        open={openDialog != null && openDialog.type === "image"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
      />

      <AIPromptDialog
        open={openDialog != null && openDialog.type === "ai_prompt"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
        params={params}
        {...(openDialog?.options || {})}
      />

      {alerts.map((alert: Alert) => (
        <Snackbar
          key={alert.id}
          onClose={() => handleCloseAlert(alert.id)}
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <RichTextAlert
            severity={alert.severity}
            title={alert.title}
            icon={alert.icon}
            onClose={() => handleCloseAlert(alert.id)}
          >
            {alert.content}
          </RichTextAlert>
        </Snackbar>
      ))}
    </RichTextDialogsContext.Provider>
  );
};

export default RichTextDialogsContainer;
