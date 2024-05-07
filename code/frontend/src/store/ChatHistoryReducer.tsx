import * as React from 'react';

type ChatHistoryState = {
    isChatHistoryOpen: boolean;
    currentChat: any;
    chatHistory: any;
}

type ChatHistoryAction =
| {
    type: 'TOGGLE_CHAT_HISTORY'
}
| {
    type: 'UPDATE_CURRENT_CHAT',
    payload: any
}
| {
    type: 'UPDATE_CHAT_HISTORY',
    payload: any
}
| {
    type: 'FETCH_CHAT_HISTORY',
    payload: any
}
const ChatHistoryReducer = (state: ChatHistoryState, action: ChatHistoryAction) => {
    switch(action.type) {
        case 'TOGGLE_CHAT_HISTORY':
            return {
                ...state,
                isChatHistoryOpen: !state.isChatHistoryOpen
            }
        case 'UPDATE_CURRENT_CHAT':
            return {
                ...state,
                currentChat: action.payload
            }
        case 'UPDATE_CHAT_HISTORY':
            if (!state.chatHistory || !state.currentChat) {
                return state;
            }
            const conversationIndex = state.chatHistory.findIndex((conversation: any) => conversation.id === action.payload.id);
            if (conversationIndex !== -1) {
                const updatedChatHistory = {...state.chatHistory};
                updatedChatHistory[conversationIndex] = state.currentChat
                return { ...state, chatHistory: updatedChatHistory }
            } else {
                return { ...state, chatHistory: [...state.chatHistory, action.payload]}
            }
        case 'FETCH_CHAT_HISTORY':
            return {
                ...state,
                chatHistory: action.payload
            }

        default:
            return state;
    }
}

export default ChatHistoryReducer;
