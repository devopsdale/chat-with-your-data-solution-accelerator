import * as React from 'react';
import { chatHistoryReducer } from './ChatHistoryReducer';

const initialState = {
    messages: [],
};

const ChatHistoryContext = React.createContext<any>(null);

const ChatHistoryProvider = ({ children }: any) => {
    const [state, dispatch] = React.useReducer(chatHistoryReducer, initialState);

    return (
        <ChatHistoryContext.Provider value={{ state, dispatch }}>
            {children}
        </ChatHistoryContext.Provider>
    );
};

export default ChatHistoryProvider;
export const useChatHistory = () => {
    const context = React.useContext(ChatHistoryContext);
    if ( !context ) {
        throw new Error('useChatHistory must be used within a ChatHistoryProvider');
    }
    return context;
};
