import * as React from 'react';
import { useChatHistory } from '../../store/ChatHistoryContext';
import { CosmosClient } from '@azure/cosmos';

const COSMOS_ENDPOINT = ""
const COSMOS_KEY = ""
const COSMOS_CONNECTION_STRING = ""
const COSMOS_CONTAINER_ID = ""

//
// const client = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY });

// const database = client.database("DATABASE_ID")
// const container = database.container("CONTAINER_ID")


function ChatHistory(){
    const chatHistoryContext = useChatHistory();
    // const [chatHistory, setChatHistory] = React.useState([]);
    //
    // React.useEffect(() => {
    //     const fetchChatHistory = async () => {
    //         try {
    //             const { resources } = await container.items
    //                 .query({ query: "SELECT * FROM c" })
    //                 .fetchAll();
    //             // @ts-ignore
    //             setChatHistory(resources);
    //         } catch (error) {
    //             console.error("Error fetching data from CosmosDB:", error);
    //         }
    //     };
    //     fetchChatHistory();
    // }, [])
    return (
        <div>
            <h1>Chat History</h1>
        </div>
    )
}

export default ChatHistory;
