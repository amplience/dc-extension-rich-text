import React from 'react';
import ReactDOM from 'react-dom';
import { AddIcon, Chooser, ChooserActions, DeleteIcon, StyledFab, withTheme } from 'unofficial-dynamic-content-ui';
import InlineChooser from '../InlineChooser/InlineChooser';

import { CircularProgress, WithStyles, withStyles } from '@material-ui/core';

// tslint:disable-next-line
import BrokenImageIcon from '@material-ui/icons/BrokenImage';

import clsx from 'clsx';
import { DynamicContentToolOptions } from '../DynamicContentTools/DynamicContentToolOptions';

const styles = {
    root: {
        '&$broken, &$invalid': {
            background: '#e5e5e5'
        }
    },
    image: {
        maxWidth: '100%'
    },
    loading: {
    },
    broken: {
    },
    invalid: {
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

    // BrokenImageIcon
    const [broken, setBroken] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleLoading = React.useCallback(() => {
        setLoading(true);
    }, [setLoading]);

    const handleError = React.useCallback(() => {
        setBroken(true);
        setLoading(false);
    }, [setBroken, setLoading]);

    const handleLoaded = React.useCallback(() => {
        setBroken(false);
        setLoading(false);
    }, [setBroken, setLoading]);


    const hasValidValue = value && value.endpoint && value.name;

    //Workaround for ts-jest
    const Fab: any = StyledFab as any;

    return (
        <div 
            className={clsx(classes.root, {
                [classes.broken]: broken,
                [classes.loading]: loading,
                [classes.invalid]: !hasValidValue
            })}
        >
            <InlineChooser variant="populated-slot" aspectRatio={broken || loading || !hasValidValue ? '3:1' : undefined}>
                
                {
                    hasValidValue ?
                        (
                            <img 
                                className={classes.image} 
                                src={`//${options && options.dynamicContent && options.dynamicContent.stagingEnvironment ? options.dynamicContent.stagingEnvironment : value.defaultHost}/i/${value.endpoint}/${encodeURIComponent(value.name)}`} 
                                onLoadStart={handleLoading}
                                onError={handleError} 
                                onLoad={handleLoaded}
                                alt="" 
                            />
                        ) : false
                }

                <div className={classes.statusIcons}>
                    {
                        loading ? 
                            <CircularProgress /> :
                            (broken || !hasValidValue ? <BrokenImageIcon fontSize="large" /> : false)
                    }
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


export class DcImageLinkView {
    public dom: any;

    constructor(
        private node: any, 
        private view: any, 
        private getPos: any,
        private options: DynamicContentToolOptions = {}) 
    {
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