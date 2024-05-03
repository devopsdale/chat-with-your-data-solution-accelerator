import * as React from 'react';
import {chatHistoryReducer, Conversation} from './ChatHistoryReducer';
import { historyList } from "../api";

const initialState = {
    isChatHistoryOpen: false,
    chatHistoryLoadingState: "",
    chatHistory: null,
    filteredChatHistory: null,
    currentChat: null,
    isCosmosDBAvailable: {
        cosmosDB: false,
        status: "Not configured"
    },
};

const ChatHistoryContext = React.createContext<any>(null);

const ChatHistoryProvider = ({ children }: any) => {
    const [state, dispatch] = React.useReducer(chatHistoryReducer, initialState);

    React.useEffect(() => {
        const fetchChatHistory = async (offset = 0): Promise<Conversation[] | null> => {
            const result = await historyList(offset)
                .then(response => {
                    if (response) {
                        dispatch({ type: 'FETCH_CHAT_HISTORY', payload: response })
                    } else {
                        dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null })
                    }
                    return response
                })
                .catch(_err => {
                    dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: "FAIL" })
                    dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null })
                    console.error('There was an issue fetching your data.')
                    return null
                })
            return result
        }
        // const getHistoryEnsure = async () => {
        //     dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Loading })
        //     historyEnsure()
        //         .then(response => {
        //             if (response?.cosmosDB) {
        //                 fetchChatHistory()
        //                     .then(res => {
        //                         if (res) {
        //                             dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Success })
        //                             dispatch({ type: 'SET_COSMOSDB_STATUS', payload: response })
        //                         } else {
        //                             dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Fail })
        //                             dispatch({
        //                                 type: 'SET_COSMOSDB_STATUS',
        //                                 payload: { cosmosDB: false, status: CosmosDBStatus.NotWorking }
        //                             })
        //                         }
        //                     })
        //                     .catch(_err => {
        //                         dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Fail })
        //                         dispatch({
        //                             type: 'SET_COSMOSDB_STATUS',
        //                             payload: { cosmosDB: false, status: CosmosDBStatus.NotWorking }
        //                         })
        //                     })
        //             } else {
        //                 dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Fail })
        //                 dispatch({ type: 'SET_COSMOSDB_STATUS', payload: response })
        //             }
        //         })
        //         .catch(_err => {
        //             dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Fail })
        //             dispatch({ type: 'SET_COSMOSDB_STATUS', payload: { cosmosDB: false, status: CosmosDBStatus.NotConfigured } })
        //         })
        // }

    }, [])


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
