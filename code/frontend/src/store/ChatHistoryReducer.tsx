import * as React from "react";

export type ChatMessage = {
    id: string;
    role: string;
    content: string;
    date: string;
};

export type Conversation = {
    content: string;
    id: string;
    title: string;
    messages: ChatMessage[];
    date: string;
};

type ChatHistoryState = {
    messages: string[];
    isChatHistoryOpen: boolean;
    chatHistoryLoadingState: string;
    isCosmosDBAvailable: boolean | string;
    chatHistory: Conversation[] | null;
    currentChat: Conversation | null;
};

type ChatHistoryAction =
    | { type: 'TOGGLE_CHAT_HISTORY' }
    | { type: 'SET_COSMOSDB_STATUS'; payload: any }
    | { type: 'UPDATE_CHAT_HISTORY_LOADING_STATE'; payload: any }
    | { type: 'UPDATE_CURRENT_CHAT'; payload: Conversation | null }
    | { type: 'UPDATE_FILTERED_CHAT_HISTORY'; payload: Conversation[] | null }
    | { type: 'UPDATE_CHAT_HISTORY'; payload: Conversation }
    | { type: 'UPDATE_CHAT_TITLE'; payload: Conversation }
    | { type: 'DELETE_CHAT_ENTRY'; payload: string }
    | { type: 'DELETE_CHAT_HISTORY' }
    | { type: 'DELETE_CURRENT_CHAT_MESSAGES'; payload: string }
    | { type: 'FETCH_CHAT_HISTORY'; payload: Conversation[] | null }


export const chatHistoryReducer = (
    state: ChatHistoryState,
    action: ChatHistoryAction
): any => {
    switch (action.type) {
        case "TOGGLE_CHAT_HISTORY":
            return {
                ...state,
                isChatHistoryOpen: !state.isChatHistoryOpen,
            };
        case "UPDATE_CURRENT_CHAT":
            return {
                ...state,
                currentChat: action.payload,
            };
        case "UPDATE_CHAT_HISTORY_LOADING_STATE":
            return {
                ...state,
                chatHistoryLoadingState: action.payload,
            };
        case "UPDATE_CHAT_HISTORY":
            if (!state.chatHistory || !state.currentChat) {
                return state;
            }
            const conversationIndex = state.chatHistory.findIndex((conv: any) => conv.id === action.payload);
            if (conversationIndex !== -1) {
                const updatedChatHistory = [...state.chatHistory];
                updatedChatHistory[conversationIndex] = state.currentChat;
                return {
                    ...state,
                    chatHistory: updatedChatHistory,
                };
            } else {
                return {
                    ...state,
                    chatHistory: [...state.chatHistory, action.payload],
                };
            }
        case 'DELETE_CHAT_ENTRY':
            if (!state.chatHistory) {
                return {...state, chatHistory: []}
            }
            const filteredChat = state.chatHistory.filter((chat: { id: any; }) => chat.id !== action.payload)
            state.currentChat = null
            //TODO: make api call to delete conversation from DB
            return {...state, chatHistory: filteredChat}
        case 'DELETE_CHAT_HISTORY':
            //TODO: make api call to delete all conversations from DB
            return {...state, chatHistory: [], filteredChatHistory: [], currentChat: null}
        case 'DELETE_CURRENT_CHAT_MESSAGES':
            //TODO: make api call to delete current conversation messages from DB
            if (!state.currentChat || !state.chatHistory) {
                return state
            }
            const updatedCurrentChat = {
                ...state.currentChat,
                messages: []
            }
            return {
                ...state,
                currentChat: updatedCurrentChat
            }
        case 'FETCH_CHAT_HISTORY':
            return {...state, chatHistory: action.payload}
        case 'SET_COSMOSDB_STATUS':
            return {...state, isCosmosDBAvailable: action.payload}
        default:
            return state;
    }
};
