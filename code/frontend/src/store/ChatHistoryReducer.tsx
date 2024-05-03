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
};

type ChatHistoryAction =
  | { type: "ADD_CONVERSATION"; payload: Conversation }
  | { type: "REMOVE_CONVERSATION"; payload: string };



export const chatHistoryReducer = (
  state: any,
  action: any
): any => {
  switch (action.type) {
      case "USE_MOCK_DATA":
        return {
          ...state,
          messages: action.payload,
        };
      case "ADD_CONVERSATION":
        console.log("ADD_CONVERSATION", action.payload);
    // case "ADD_CONVERSATION":
    //   return {
    //     ...state,
    //     messages: [...state.messages, action.payload.content],
    //   };
    // case "REMOVE_CONVERSATION":
    //   return {
    //     ...state,
    //     messages: state.messages.filter(
    //       (conversation: any) => conversation.id !== action.payload
    //     ),
    //   };
    default:
      return state;
  }
};

export const ChatHistoryContext = React.createContext<{
  state: ChatHistoryState;
  dispatch: React.Dispatch<ChatHistoryAction>;
}>({
  state: { messages: [] },
  dispatch: () => null,
});
