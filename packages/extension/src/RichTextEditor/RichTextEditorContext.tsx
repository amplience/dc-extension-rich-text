import React, { useReducer } from "react";
import { RichTextEditorContext } from '@dc-extension-rich-text/common';

const context = React.createContext<RichTextEditorContext>({
    locked: false,
    lockEditor: () => {},
    unlockEditor: () => {}
});
export default context;

export const withRichTextEditorContext = (Component: React.ComponentType) => {
    return (componentProps: any) => {
        const [rteState, dispatchRTEEvent] = useReducer((state, action) => {
            switch (action.type) {
              case 'LOCK_EDITOR':
                return {...state, locked: true};
              case 'UNLOCK_EDITOR':
                return {...state, locked: false};
              default:
                return state;
            }
          }, {locked: false});
    
        const props = {
            ...rteState,
            lockEditor() {
                dispatchRTEEvent({type: 'LOCK_EDITOR'});
            },
            unlockEditor() {
                dispatchRTEEvent({type: 'UNLOCK_EDITOR'});
            }
        };
    
        return <context.Provider value={props}>
            <Component {...componentProps} />
        </context.Provider>;
    }
};