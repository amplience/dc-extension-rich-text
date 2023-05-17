import React from 'react';

import { isToolEnabled, ProseMirrorTool, inBlock, getSelectionMarks } from '@dc-extension-rich-text/common';
import { ContentItemLink, MediaImageLink } from 'dc-extensions-sdk';
import { DynamicContentToolOptions } from './DynamicContentToolOptions';

// tslint:disable-next-line
import AddCircleIcon from '@material-ui/icons/AddCircle';
// tslint:disable-next-line
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
// tslint:disable-next-line
import AddLocationIcon from '@material-ui/icons/AddLocation';
const { toggleMark } = require("prosemirror-commands");


export function dcImageLink(schema: any, dialog?: (value?: MediaImageLink) => Promise<MediaImageLink>): ProseMirrorTool {
    const node = schema.nodes['dc-image-link'];

    return {
        name: 'dc-image-link',
        label: 'Insert Image',
        displayIcon: <ImageSearchIcon />,
        isEnabled: (state: any) => !inBlock(state),
        apply: async (state: any, dispatch: any, view: any) => {
            if (!dialog) {
                return;
            }

            try {
                const value = await dialog();
                view.dispatch(view.state.tr.replaceSelectionWith(node.createAndFill({
                    value
                })));
            // tslint:disable-next-line
            } catch (err) {
            }
        }
    };
}


export function dcContentLink(schema: any, contentTypes: string[], dialog?: (contentTypeIds: string[], value?: ContentItemLink) => Promise<ContentItemLink>): ProseMirrorTool {
    const node = schema.nodes['dc-content-link'];

    return {
        name: 'dc-content-link',
        label: 'Insert Content',
        displayIcon: <AddCircleIcon />,
        isEnabled: (state: any) => !inBlock(state),
        apply: async (state: any, dispatch: any, view: any) => {
            if (!dialog) {
                return;
            }

            try {
                const value = await dialog(contentTypes);
                view.dispatch(view.state.tr.replaceSelectionWith(node.createAndFill({
                    value
                })));
            // tslint:disable-next-line
            } catch (err) {
            }
        }
    };
}

export function dcContentLinkUrl(schema: any, contentTypes: string[], dialog?: (contentTypeIds: string[], value?: ContentItemLink) => Promise<ContentItemLink>): ProseMirrorTool {
    const node = schema.nodes['dc-content-link-url'];

    return {
        name: 'dc-content-link-url',
        label: 'Insert link url',
        displayIcon: <AddLocationIcon />,
        isEnabled: (state: any) => {
            return !state.selection.empty || getSelectionMarks(state).filter(mark => mark.mark.type === schema.marks.link).length > 0;
          },
        apply: async (state: any, dispatch: any, view: any) => {
            if (!dialog) {
                return;
            }
            const marks = getSelectionMarks(state);

            try {
                const value = await dialog(contentTypes);
                const content = view.state.selection.content()
                const newAttrs = {
                    href: 'id:' + value.id,
                    title: undefined
                };
                
                if (content && content.content && content.content.content && content.content.content.length > 0) {
                    toggleMark(schema.marks.link, newAttrs)(state, dispatch, view);
                }
                view.dispatch(view.state.tr.setMeta('content-type', JSON.stringify(value)));
            // tslint:disable-next-line
            } catch (err) {
                console.log(err)
            }
        }
    };
}

export function createDynamicContentTools(schema: any, options: DynamicContentToolOptions): ProseMirrorTool[] {
    const tools: ProseMirrorTool[] = [];

    if (isToolEnabled('dc-image-link', options) && schema.nodes['dc-image-link']) {
        tools.push(dcImageLink(schema, options.dialogs ? options.dialogs.getDcImageLink : undefined));
    }

    if (isToolEnabled('dc-content-link', options) &&
        schema.nodes['dc-content-link'] &&
        // must provide a list of content types for this tool to be active
        options.tools && options.tools["dc-content-link"] && options.tools["dc-content-link"].contentTypes && options.tools["dc-content-link"].contentTypes) {
        tools.push(dcContentLink(schema, options.tools["dc-content-link"].contentTypes, options.dialogs ? options.dialogs.getDcContentLink : undefined));
    }
    if (
        options.tools && options.tools["dc-content-link-url"] && options.tools["dc-content-link-url"].contentTypes
    ) {
        tools.push(dcContentLinkUrl(schema, options.tools["dc-content-link-url"].contentTypes, options.dialogs ? options.dialogs.getDcContentLink : undefined))
    }

    return tools;
}
