import * as React from 'react';
import ChatHistoryReducer from './ChatHistoryReducer';
import { mockChat } from './mockChat';


const initialState = {
    isChatHistoryOpen: false,
    currentChat: null,
    chatHistory: []
}

const ChatHistoryContext = React.createContext<any>(null);

export const historyList = async (offset = 0): Promise<any[] | null> => {
    const response = await fetch(`/history/list?offset=${offset}`, {
        method: 'GET'
    })
        .then(async res => {
            const payload = await res.json()
            if (!Array.isArray(payload)) {
                console.error('There was an issue fetching your data.')
                return null
            }
            const conversations: any[] = await Promise.all(
                payload.map(async (conv: any) => {
                    let convMessages: any[] = []
                    convMessages = await historyRead(conv.id)
                        .then(res => {
                            return res
                        })
                        .catch(err => {
                            console.error('error fetching messages: ', err)
                            return []
                        })
                    const conversation: any = {
                        id: conv.id,
                        title: conv.title,
                        date: conv.createdAt,
                        messages: convMessages
                    }
                    return conversation
                })
            )
            return conversations
        })
        .catch(_err => {
            console.error('There was an issue fetching your data.')
            return null
        })

    return response
}

export const historyRead = async (convId: string): Promise<any[]> => {
    const response = await fetch('/history/read', {
        method: 'POST',
        body: JSON.stringify({
            conversation_id: convId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async res => {
            if (!res) {
                return []
            }
            const payload = await res.json()
            const messages: any[] = []
            if (payload?.messages) {
                payload.messages.forEach((msg: any) => {
                    const message: any = {
                        id: msg.id,
                        role: msg.role,
                        date: msg.createdAt,
                        content: msg.content,
                        feedback: msg.feedback ?? undefined
                    }
                    messages.push(message)
                })
            }
            return messages
        })
        .catch(_err => {
            console.error('There was an issue fetching your data.')
            return []
        })
    return response
}


const ChatHistoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer(ChatHistoryReducer, initialState);
    React.useEffect(() => {
        const fetchChatHistory = async (offset = 0): Promise<any[] | null> => {
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
                    // dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.Fail })
                    dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null })
                    console.error('There was an issue fetching your data.')
                    return null
                })
            return result
        }
        dispatch({ type: 'FETCH_CHAT_HISTORY', payload: mockChat })

    }, [dispatch])
    return (
        <ChatHistoryContext.Provider value={{ state, dispatch }}>
            {children}
        </ChatHistoryContext.Provider>
    )
}

export default ChatHistoryProvider;

export const useChatHistory = () => {
    const context = React.useContext(ChatHistoryContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
}
