import React from 'react';
import ReactDOM from 'react-dom';
import { ChooserActions, ContentItem as ContentItemIcon, DeleteIcon, getContentTypeCard, getContentTypeIcon, StyledFab, Visualization, withTheme } from 'unofficial-dynamic-content-ui';
import InlineChooser from '../InlineChooser/InlineChooser';

import { WithStyles, withStyles } from '@material-ui/core';
import clsx from 'clsx';

import { DynamicContentToolOptions } from '../DynamicContentTools/DynamicContentToolOptions';

const styles = {
    root: {
        '&$broken, &$invalid': {
            background: '#e5e5e5'
        },
        boxShadow: "0 1px 5px 0 rgba(23,32,44,.2), 0 2px 2px 0 rgba(23,32,44,.1), 0 3px 1px -2px rgba(23,32,44,.1)"
    },
    invalid: {
    },
    content: {
        position: "absolute" as "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%"
    },
    statusIcons: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        position: 'absolute' as 'absolute',
        alignItems: 'center' as 'center',
        alignContent: 'center' as 'center',
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center'
    }
};

interface Props extends WithStyles<typeof styles> {
    options: DynamicContentToolOptions,
    node: any,
    onDelete: () => void;
}

const ViewComponent = withStyles(styles)((props: Props) => {
    const {
        node,
        onDelete,
        classes,
        options
    } = props;

    const value = node.attrs.value;
    const hasValidValue = value && value.id && value.contentType;

    const contentLinkOptions = options.tools && options.tools["dc-content-link"] ? options.tools["dc-content-link"] : undefined;

    const customIcon: string | undefined = contentLinkOptions && contentLinkOptions.contentTypeSettings && hasValidValue ? getContentTypeIcon(contentLinkOptions.contentTypeSettings, value.contentType) : undefined;
    const cardTemplateUrl: string | undefined = contentLinkOptions && contentLinkOptions.contentTypeSettings && hasValidValue ? getContentTypeCard(contentLinkOptions.contentTypeSettings, value.contentType) : undefined;
    const aspectRatio = contentLinkOptions && contentLinkOptions.contentTypeSettings && contentLinkOptions.contentTypeSettings.aspectRatios && hasValidValue ? getContentTypeAspectRatio(contentLinkOptions.contentTypeSettings.aspectRatios, value.contentType) : undefined;

    //Workaround for ts-jest
    const Fab: any = StyledFab as any;

    return (
        <div 
            className={clsx(classes.root, { [classes.invalid]: !hasValidValue })}
        >
            <InlineChooser variant="populated-slot" aspectRatio={aspectRatio || '3:1'}>

                <div
                    className={clsx(classes.content)}
                    style={{
                        backgroundImage: `url(${customIcon || ContentItemIcon})`
                    }}
                >
                    {cardTemplateUrl && options && options.dynamicContent && options.dynamicContent.stagingEnvironment ? (
                        <Visualization
                            template={cardTemplateUrl}
                            params={{
                                contentItemId: value.id,
                                stagingEnvironment: options.dynamicContent.stagingEnvironment
                            }}
                        />
                    ) : (
                            false
                        )}
                </div>

                <ChooserActions variant="populated-slot">
                    <Fab variant="dark" onClick={onDelete}>
                        {DeleteIcon}
                    </Fab>
                </ChooserActions>
            </InlineChooser>
        </div>
    );
});


export function getContentTypeAspectRatio(
    aspectRatios: { [schemaId: string]: string },
    schemaId: string
): string | undefined {
    for (const key of Object.keys(aspectRatios)) {
        if (key === "*" || key === schemaId) {
            return aspectRatios[key];
        }
    }
}

export class DcContentLinkView {
    public dom: any;

    constructor(
        private node: any,
        private view: any,
        private getPos: any,
        private options: DynamicContentToolOptions = {}) {
        this.dom = document.createElement('div');
        this.handleDelete = this.handleDelete.bind(this);
        this.render();
    }

    public handleDelete(): void {
        const start = this.getPos();
        const tr = this.view.state.tr.delete(start, start + this.node.nodeSize);
        this.view.dispatch(tr);
    }

    public render(): void {
        ReactDOM.render(withTheme(<ViewComponent options={this.options} node={this.node} onDelete={this.handleDelete} />), this.dom);
    }
}