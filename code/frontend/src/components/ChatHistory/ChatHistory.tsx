import * as React from 'react';
import { useChatHistory } from '../../store/ChatHistoryContext';


const ChatHistory = () => {
    const { state, dispatch } = useChatHistory();


    return (
        <div>
            <h1>Chat History</h1>
        </div>
    )
}

export default ChatHistory;
