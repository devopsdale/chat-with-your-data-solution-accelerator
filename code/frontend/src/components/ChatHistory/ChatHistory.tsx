import { useState, useRef } from 'react';
import { useChatHistory } from '../../store/ChatHistoryContext';
import { CosmosClient } from '@azure/cosmos';
import styles from '../../pages/chat/Chat.module.css';
import {
  historyList,
  historyDelete,
  historyEnsure,
  historyGenerate,
  historyRead,
  historyUpdate
} from '../../api';
import { v4 as uuidv4 } from 'uuid';
import { Stack } from '@fluentui/react';
import { QuestionInput } from '../QuestionInput';
import { DismissRegular, RecordStopFilled } from '@fluentui/react-icons';
import { useParams } from "react-router-dom";
import { Sidebar } from '../Sidebar';
import { Avatar, Spinner } from "@fluentui/react-components";
import moment from 'moment';
import { Answer } from '../Answer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const COSMOS_ENDPOINT = ""
const COSMOS_KEY = ""
const COSMOS_CONNECTION_STRING = ""
const COSMOS_CONTAINER_ID = ""


interface IMessage {
  timestamp: string;
  sender: string;
  message: string;
}

interface IChatData {
  userId: string;
  conversationId: string;
  messages: IMessage[];
}



function ChatHistory() {
  const [pageAnimOn, setPageAnimOn] = useState<boolean>(false);
  const [pageAnimOff, setPageAnimOff] = useState<boolean>(false);
  const lastQuestionRef = useRef<string>("");
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const { threadId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] =
    useState<
      [
        content: string,
        id: string,
        title: string,
        filepath: string,
        url: string,
        metadata: string,
      ]
    >();
  const [isCitationPanelOpen, setIsCitationPanelOpen] =
    useState<boolean>(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const abortFuncs = useRef([] as AbortController[]);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const [userMessage, setUserMessage] = useState("");
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<any | null>(null);

  const currentConversation = {
    messages: [],
    conversation_id: "",
    title: "New Thread"
  }

  const processResultMessage = (result: any, userMessage?: string, conversationId?: string) => {
    switch (result.role) {
      case "user":
        return;
      case "tool":
        return;
      case "":
        return;
      default:
        return;
    }
  }
  const handleLoadChatHistory = async () => { }
  const handleSaveChatHistory = async () => { }
  const handleLoadConversation = async () => { }
  const updateConversation = async () => { }
  const handleGenerateChatHistory = async () => { }


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

    return errorMessage
  }

  const onShowCitation = (citation: any) => {
    // console.log('citation: ', citation);

    setActiveCitation([
      citation.content,
      citation.id,
      citation.title ?? "",
      citation.filepath ?? "",
      "",
      "",
    ]);

    if (citation?.metadata?.original_url) {
      window.open(citation.metadata.original_url, "_blank");
    } else {
      alert("No source URL found");
    }
  };

  const parseCitationFromMessage = (message: any) => {
    if (message.role === "tool") {
      try {
        const toolMessage = JSON.parse(message.content);
        return toolMessage.citations;
      } catch {
        return [];
      }
    }
    return [];
  };


  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setShowLoadingMessage(false);
    setIsLoading(false);
  };


  function makeApiRequest(question: string): void {
    throw new Error('Function not implemented.');
  }

  const [chatData, setChatData] = useState<IChatData>({
    userId: 'user123',
    conversationId: 'conv123',
    messages: [{
      timestamp: new Date().toISOString(),
      sender: 'user123',
      message: 'Sample message for initial upload'
    }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatData({
      ...chatData,
      messages: [{
        ...chatData.messages[0],
        [e.target.name]: e.target.value
      }]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/store_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: chatData.userId,
          conversationId: chatData.conversationId,
          message: chatData.messages[0]
        })
      });
      const data = await response.json();
      alert('Chat uploaded successfully: ' + JSON.stringify(data));
    } catch (error) {
      alert('Error uploading chat: ' + error);
    }
  };


  return (
    <div
      className={`
      ${styles.container}
      ${pageAnimOn ? styles.pageAnimOn : ""}
      ${pageAnimOff ? styles.pageAnimOff : ""}
    `}
    >
      <Sidebar threadId={''} />

      <Stack horizontal className={styles.chatRoot}>
        <div
          className={`${styles.chatContainer} ${styles.MobileChatContainer}`}
        >
          {/* {!lastQuestionRef.current ? ( */}

          {/* ↓ this should only show when no chats */}
          <Stack
            className={`
              ${styles.chatEmptyState}
              ${!lastQuestionRef.current ? styles.screenOn : styles.screenOff}
            `}
          >
            <div
              className={`
               ${styles.exploreTextContainer}
               ${pageAnimOn ? styles.pageAnimOn : styles.pageAnimOff}
              `}
            >
              <h6 className={`${styles.exploreText} ${styles.chatHomeText03}`}>
                <span>Let's explore together</span>
              </h6>
              <h5 className={`${styles.exploreText} ${styles.chatHomeText02}`}>
                <span>Let's explore together</span>
              </h5>
              <h3 className={`${styles.exploreText} ${styles.chatHomeText01}`}>
                <span>Let's explore together</span>
              </h3>
            </div>
          </Stack>

          {/* this should show when chat is engaged */}
          <div
            className={`
                ${styles.chatMessageStream}
                ${lastQuestionRef.current ? styles.screenOn : styles.screenOff}
              `}
            style={{ marginBottom: isLoading ? "40px" : "0px" }}
          >
            <div className={styles.chatMessageStreamInner}>
              {answers.map((answer, index) => (
                <div key={index}>
                  {answer.role === "user" ? (
                    <div className={`${styles.chatMessageUser}`} key={index}>
                      <Avatar
                        image={{ src: "../../eddie-hoover-user-avatar.png" }}
                        aria-label="Guest"
                        className={styles.chatAvatar}
                      />
                      <div className={styles.chatMessageUserMessage}>
                        {answer.content}
                      </div>
                      <div className={` ${styles.timeStamp}`}>
                        {/* ↓ TEMP - this will need to be timestamp from BE */}
                        <div>{moment().calendar()}</div>
                      </div>
                    </div>
                  ) : answer.role === "assistant" || answer.role === "error" ? (
                    <div
                      className={`${styles.chatMessageGpt} ${styles.answerShowing}`}
                      key={index}
                    >
                      <Avatar
                        image={{ src: "../../pronto-avatar-anim-close.gif" }}
                        aria-label="Guest"
                        className={styles.chatAvatar}
                      />
                      <Answer
                        answer={{
                          answer:
                            answer.role === "assistant"
                              ? answer.content
                              : "Sorry, an error occurred. Try refreshing the conversation or waiting a few minutes. If the issue persists, contact your system administrator. Error: " +
                              answer.content,
                          citations:
                            answer.role === "assistant"
                              ? parseCitationFromMessage(answers[index - 1])
                              : [],
                        }}
                        onCitationClicked={(c) => onShowCitation(c)}
                        index={index}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
              {showLoadingMessage && (
                <>
                  <div className={styles.chatMessageUser}>
                    <Avatar
                      image={{ src: "../../eddie-hoover-user-avatar.png" }}
                      aria-label="Guest"
                      className={styles.chatAvatar}
                    />
                    <div className={styles.chatMessageUserMessage}>
                      {lastQuestionRef.current}
                    </div>
                  </div>
                  <div className={styles.chatMessageGpt}>
                    <Avatar
                      image={{ src: "../../pronto-avatar-anim-close.gif" }}
                      aria-label="Guest"
                      className={styles.chatAvatar}
                    />
                    <Answer
                      answer={{
                        answer:
                          "Generating Answer... AI-generated content may be incorrect",
                        citations: [],
                      }}
                      onCitationClicked={() => null}
                      index={0}
                    />
                    <Spinner
                      size="extra-small"
                      className={styles.thinkingSpinner}
                      labelPosition="after"
                      label="Thinking..."
                    />
                  </div>
                </>
              )}
              <div ref={chatMessageStreamEnd} />
            </div>
          </div>
          {/* )} */}
          <div>
            {isRecognizing && !isListening && <p>Please wait...</p>}{" "}
            {isListening && <p>Listening...</p>}{" "}
          </div>

          <Stack
            horizontal
            className={`
              ${styles.chatInput}
              ${!lastQuestionRef.current ? "" : styles.chatThreadActive}
              ${pageAnimOn ? styles.pageAnimOn : ""}
            `}
          >
            {isLoading && (
              <Stack
                horizontal
                className={styles.stopGeneratingContainer}
                role="button"
                aria-label="Stop generating"
                tabIndex={0}
                onClick={stopGenerating}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === " " ? stopGenerating() : null
                }
              >
                <RecordStopFilled
                  className={styles.stopGeneratingIcon}
                  aria-hidden="true"
                />
                <span className={styles.stopGeneratingText} aria-hidden="true">
                  Stop Pronto
                </span>
              </Stack>
            )}

            <QuestionInput
              clearOnSend
              placeholder="Ask anything..."
              disabled={isLoading}
              onSend={(question) => makeApiRequest(question)}
              recognizedText={recognizedText}
              onMicrophoneClick={() => { }}
              onStopClick={() => { }}
              isListening={false}
              isRecognizing={false}
              setRecognizedText={setRecognizedText}
              onClearChat={() => { }}
              isThreadActive={!!lastQuestionRef.current}
            />
          </Stack>
        </div>
        {answers.length > 0 && isCitationPanelOpen && activeCitation && (
          <Stack.Item
            className={`${styles.citationPanel} ${styles.mobileStyles}`}
          >
            <Stack
              horizontal
              className={styles.citationPanelHeaderContainer}
              horizontalAlign="space-between"
              verticalAlign="center"
            >
              <span className={styles.citationPanelHeader}>Citations</span>
              <DismissRegular
                className={styles.citationPanelDismiss}
                onClick={() => setIsCitationPanelOpen(false)}
              />
            </Stack>
            <h5
              className={`${styles.citationPanelTitle} ${styles.mobileCitationPanelTitle}`}
            >
              {activeCitation[2]}
            </h5>
            <ReactMarkdown
              className={`${styles.citationPanelContent} ${styles.mobileCitationPanelContent}`}
              children={activeCitation[0]}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            />
          </Stack.Item>
        )}
      </Stack>

      {/* {isLoading && ( */}
      {true && (
        <div
          className={`
          ${styles.generatingAnim}
          ${!lastQuestionRef.current ? styles.screenOn : styles.screenOff}
          ${isLoading ? styles.fadeOnAurora : styles.fadeOffAurora}
        `}
        >
          <div
            className={`
            ${styles.generatingAnimInner}
            ${!lastQuestionRef.current ? styles.screenOn : styles.screenOff}
          `}
          >
            <div className={styles.hue01}>
              <img
                className={styles.hue01img01}
                src="../../auroraLoading/hue01_shape01.png"
              />
              <img
                className={styles.hue01img02}
                src="../../auroraLoading/hue01_shape02.png"
              />
            </div>
            <div className={styles.hue02}>
              <img
                className={styles.hue02img01}
                src="../../auroraLoading/hue02_shape01.png"
              />
              <img
                className={styles.hue02img02}
                src="../../auroraLoading/hue02_shape02.png"
              />
            </div>
          </div>
        </div>
      )}
      <div
        className={`
        ${styles.bgPatternImgContainer}
        ${pageAnimOn ? styles.pageAnimOn : styles.pageAnimOff}
      `}
      >
        <img
          src="../../Airbus_CarbonGrid.png"
          className={`
            ${styles.bgPatternImg}
            ${!lastQuestionRef.current ? styles.screenOn : styles.screenOff}
          `}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export default ChatHistory;
