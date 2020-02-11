import { isToolEnabled, ProseMirrorTool, StandardToolOptions } from "@dc-extension-rich-text/common";
import React from 'react';
import { isFilteredMarkActive, setMarkAttributes } from "../utils/MarkUtils";

export interface InlineStylesToolOptions {
    classNames?: Array<{
        label: string,
        className: string
    }>;
}

export function inlineStyleClassNameTool(schema: any, className: string, classLabel: string): ProseMirrorTool {
    const mark = schema.marks.inline_styles;
    return {
        name: "inline_styles_className_" + className,
        label: classLabel,
        displayLabel: <span className={className}>{classLabel}</span>,
        apply: setMarkAttributes(mark, { class: className }),
        isEnabled: (state: any) => true,
        isActive: (state: any) => isFilteredMarkActive(state, mark, (m) => m.attrs.class === className),
    };
}

export function createInlineStylesTools(schema: any, options: StandardToolOptions): ProseMirrorTool[] {
    const tools: ProseMirrorTool[] = [];

    if (schema.marks.inline_styles && isToolEnabled('inline_styles', options) && options.tools && options.tools.inline_styles) {
        const inlineStylesOptions: InlineStylesToolOptions = options.tools.inline_styles;

        if (inlineStylesOptions.classNames) {
            for (const className of inlineStylesOptions.classNames) {
                tools.push(inlineStyleClassNameTool(schema, className.className, className.label));
            }
        }
    }

    return tools;
}