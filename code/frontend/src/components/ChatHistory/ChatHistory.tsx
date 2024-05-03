import * as React from 'react';
import { useChatHistory } from '../../store/ChatHistoryContext';
import { CommandBarButton, IconButton, Dialog, DialogType, Stack } from '@fluentui/react'
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import { ChatMessage, Conversation } from '../../store/ChatHistoryReducer';
import { customConversationApi } from '../../api';

const ChatHistory = () => {
    const { state, dispatch } = useChatHistory();
    const [isLoading, setIsLoading] = React.useState(false);
    const [messages, setMessages] = React.useState<any[]>([])
    const [clearChat, setClearChat] = React.useState(false)
    const appStateContext = state
    const [ASSISTANT, TOOL, ERROR] = ["assistant", "tool", "error"]
    const abortFuncs = React.useRef([] as AbortController[]);
    const [processMessages, setProcessMessages] = React.useState<any>("NotRunning")
    const [showLoadingMessage, setShowLoadingMessage] = React.useState(false)
    let assistantMessage: any = {}
    let toolMessage: any = {}
    let assistantContent = ""

    const processResultMessage = (resultMessage: any, userMessage: any, conversationId?: string) => {
        if (resultMessage.role === ASSISTANT) {
            assistantContent += resultMessage.content
            assistantMessage = resultMessage
            assistantMessage.content = assistantContent

            if (resultMessage.context) {
                toolMessage = {
                    id: uuid(),
                    role: TOOL,
                    content: resultMessage.context,
                    date: new Date().toISOString()
                }
            }
        }

        if (resultMessage.role === TOOL) toolMessage = resultMessage

        if (!conversationId) {
            isEmpty(toolMessage)
                ? setMessages([...messages, userMessage, assistantMessage])
                : setMessages([...messages, userMessage, toolMessage, assistantMessage])
        } else {
            isEmpty(toolMessage)
                ? setMessages([...messages, assistantMessage])
                : setMessages([...messages, toolMessage, assistantMessage])
        }
    }


    const parseErrorMessage = (errorMessage: string) => {
        let errorCodeMessage = errorMessage.substring(0, errorMessage.indexOf('-') + 1)
        const innerErrorCue = "{\\'error\\': {\\'message\\': "
        if (errorMessage.includes(innerErrorCue)) {
          try {
            let innerErrorString = errorMessage.substring(errorMessage.indexOf(innerErrorCue))
            if (innerErrorString.endsWith("'}}")) {
              innerErrorString = innerErrorString.substring(0, innerErrorString.length - 3)
            }
            innerErrorString = innerErrorString.replaceAll("\\'", "'")
            let newErrorMessage = errorCodeMessage + ' ' + innerErrorString
            errorMessage = newErrorMessage
          } catch (e) {
            console.error('Error parsing inner error message: ', e)
          }
        }

        return (errorMessage)
      }

    const makeApiRequest = async (question: string, conversationId?: string) => {
        setIsLoading(true);
        setShowLoadingMessage(true);
        const abortController = new AbortController();
        abortFuncs.current.unshift(abortController);

        const userMessage: ChatMessage = {
            id: uuid(),
            role: 'user',
            content: question,
            date: new Date().toISOString(),
        };

        let conversation: any | null | undefined;
        if (!conversationId) {
            conversation = {
                id: uuid(),
                title: question,
                messages: [userMessage],
                date: new Date().toISOString()
            };
        } else {
            conversation = appStateContext?.state?.currentChat;
            if (!conversation) {
                console.error('Conversation not found.');
                setIsLoading(false);
                setShowLoadingMessage(false);
                abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
                return;
            } else {
                conversation.messages.push(userMessage);
            }
        }

        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: conversation });
        setMessages(conversation.messages);

        const request: any = {
            id: conversation.id,
            messages: [...conversation.messages.filter((answer: any) => answer.role !== 'error')]
        };

        let result: any = {};
        try {
            const response = await customConversationApi(request, abortController.signal);
            if (response?.body) {
                const reader = response.body.getReader();
                let runningText = '';
                while (true) {
                    setProcessMessages('Processing');
                    const { done, value } = await reader.read();
                    if (done) break;

                    var text = new TextDecoder('utf-8').decode(value);
                    const objects = text.split('\n');
                    objects.forEach(obj => {
                        try {
                            if (obj !== '' && obj !== '{}') {
                                runningText += obj;
                                result = JSON.parse(runningText);
                                if (result.choices?.length > 0) {
                                    result.choices[0].messages.forEach((msg: any) => {
                                        msg.id = uuid();
                                        msg.date = new Date().toISOString();
                                    });
                                    if (result.choices[0].messages?.some((m: any) => m.role === 'assistant')) {
                                        setShowLoadingMessage(false);
                                    }
                                    result.choices[0].messages.forEach((resultObj: any) => {
                                        conversation.messages.push(resultObj);
                                    });
                                } else if (result.error) {
                                    throw Error(result.error);
                                }
                                runningText = '';
                            }
                        } catch (e) {
                            if (!(e instanceof SyntaxError)) {
                                console.error(e);
                                throw e;
                            } else {
                                console.log('Incomplete message. Continuing...');
                            }
                        }
                    });
                }
                appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: conversation });
                setMessages(conversation.messages);
            }
        } catch (e) {
            if (!abortController.signal.aborted) {
                let errorMessage =
                    'An error occurred. Please try again. If the problem persists, please contact the site administrator.';
                if (result.error?.message) {
                    errorMessage = result.error.message;
                } else if (typeof result.error === 'string') {
                    errorMessage = result.error;
                }

                errorMessage = parseErrorMessage(errorMessage);

                let errorChatMsg: ChatMessage = {
                    id: uuid(),
                    role: 'error',
                    content: errorMessage,
                    date: new Date().toISOString()
                };
                conversation.messages.push(errorChatMsg);
                appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: conversation });
                setMessages([...messages, errorChatMsg]);
            } else {
                setMessages([...messages, userMessage]);
            }
        } finally {
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            setProcessMessages('Done');
        }

        return abortController.abort();
    };

    return (
        <div>
            <h1>Chat History</h1>
        </div>
    )
}

export default ChatHistory;
