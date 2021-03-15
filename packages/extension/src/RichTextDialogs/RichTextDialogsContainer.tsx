import React, { PropsWithChildren } from "react";

import {
  Anchor,
  Hyperlink,
  Image,
  RichTextDialogs
} from "@dc-extension-rich-text/common";
import { ContentItemLink, MediaImageLink } from "dc-extensions-sdk";
import AnchorDialog from "../AnchorDialog/AnchorDialog";
import CodeDialog from "../CodeDialog/CodeDialog";
import HyperlinkDialog from "../HyperlinkDialog/HyperlinkDialog";
import ImageDialog from "../ImageDialog/ImageDialog";
import RichTextDialogsContext from "./RichTextDialogsContext";

import { SdkContext } from "unofficial-dynamic-content-ui";

interface EditorDialogsProps extends PropsWithChildren<{}> {}

interface OpenDialog {
  type: string;
  resolve: (value: any) => void;
  reject: () => void;
  value: any;
}

const RichTextDialogsContainer: React.SFC<EditorDialogsProps> = (
  props: EditorDialogsProps
) => {
  const { children } = props;

  const [openDialog, setOpenDialog] = React.useState<OpenDialog>();

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
    (type: string, value?: any) => {
      return new Promise((resolve, reject) => {
        setOpenDialog({
          type,
          resolve,
          reject,
          value
        });
      });
    },
    [setOpenDialog]
  );

  const { sdk } = React.useContext(SdkContext);

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
    getDcImageLink: (value?: MediaImageLink): Promise<MediaImageLink> => {
      if (!sdk) {
        return Promise.reject();
      } else {
        return sdk.mediaLink.getImage();
      }
    },
    getDcContentLink: (
      contentTypeIds: string[],
      value?: ContentItemLink
    ): Promise<ContentItemLink> => {
      if (!sdk) {
        return Promise.reject();
      } else {
        return sdk.contentLink.get(contentTypeIds);
      }
    }
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
    </RichTextDialogsContext.Provider>
  );
};

export default RichTextDialogsContainer;
