import { useRef, useState, useEffect, MouseEvent } from "react";
import { Stack } from "@fluentui/react";
import {
  BroomRegular,
  DismissRegular,
  RecordStopFilled,
} from "@fluentui/react-icons";
import {
  SpeechRecognizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { v4 as uuidv4 } from "uuid";

import styles from "./Chat.module.css";
import { multiLingualSpeechRecognizer } from "../../util/SpeechToText";

import {
  ChatMessage,
  ConversationRequest,
  customConversationApi,
  Citation,
  ToolMessageContent,
  ChatResponse,
  // CitationMetadata,
} from "../../api";
import { Answer } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { Sidebar } from "../../components/Sidebar";
import { Avatar, Spinner } from "@fluentui/react-components";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";

const Chat = () => {
  const [pageAnimOn, setPageAnimOn] = useState<boolean>(false);
  const [pageAnimOff, setPageAnimOff] = useState<boolean>(false);
  const lastQuestionRef = useRef<string>("");
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const { threadId = "default" } = useParams();
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
  const [answers, setAnswers] = useState<ChatMessage[]>([]);
  const abortFuncs = useRef([] as AbortController[]);
  const [conversationId, setConversationId] = useState<string>(threadId);
  const [userMessage, setUserMessage] = useState("");
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  const makeApiRequest = async (question: string) => {
    lastQuestionRef.current = question;

    setIsLoading(true);
    setShowLoadingMessage(true);
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const userMessage: ChatMessage = {
      role: "user",
      content: recognizedText || question,
    };

    const request: ConversationRequest = {
      id: conversationId,
      messages: [...answers, userMessage],
    };

    let result = {} as ChatResponse;
    try {
      const response = await customConversationApi(
        request,
        abortController.signal
      );
      if (response?.body) {
        const reader = response.body.getReader();
        let runningText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              setShowLoadingMessage(false);
              if (result.error) {
                setAnswers([
                  ...answers,
                  userMessage,
                  { role: "error", content: result.error },
                ]);
              } else {
                setAnswers([
                  ...answers,
                  userMessage,
                  ...result.choices[0].messages,
                ]);
                saveThreads([
                  ...answers,
                  userMessage,
                  ...result.choices[0].messages,
                ]);
              }
              runningText = "";
            } catch {}
          });
        }
        setAnswers([...answers, userMessage, ...result.choices[0].messages]);
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        console.error(result);
        alert(
          "An error occurred. Please try again. If the problem persists, please contact the site administrator."
        );
      }
      setAnswers([...answers, userMessage]);
    } finally {
      setIsLoading(false);
      setShowLoadingMessage(false);
      abortFuncs.current = abortFuncs.current.filter(
        (a) => a !== abortController
      );
    }

    return abortController.abort();
  };

  const startSpeechRecognition = async () => {
    if (!isRecognizing) {
      setIsRecognizing(true);

      recognizerRef.current = await multiLingualSpeechRecognizer(); // Store the recognizer in the ref

      recognizerRef.current.recognized = (s, e) => {
        if (e.result.reason === ResultReason.RecognizedSpeech) {
          const recognized = e.result.text;
          setUserMessage(recognized);
          setRecognizedText(recognized);
        }
      };

      recognizerRef.current.startContinuousRecognitionAsync(() => {
        setIsRecognizing(true);
        setIsListening(true);
      });
    }
  };

  const stopSpeechRecognition = () => {
    if (isRecognizing) {
      // console.log("Stopping continuous recognition...");
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync(() => {
          // console.log("Speech recognition stopped.");
          recognizerRef.current?.close();
        });
      }
      setIsRecognizing(false);
      setRecognizedText("");
      setIsListening(false);
    }
  };

  const onMicrophoneClick = async () => {
    if (!isRecognizing) {
      // console.log("Starting speech recognition...");
      await startSpeechRecognition();
    } else {
      // console.log("Stopping speech recognition...");
      stopSpeechRecognition();
      setRecognizedText(userMessage);
    }
  };

  // moved clear chat into child component per design, triggered here
  const onClearChat = () => {
    clearChat();
  };

  const clearChat = () => {
    lastQuestionRef.current = "";
    setActiveCitation(undefined);
    setAnswers([]);
    setConversationId(uuidv4());
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setShowLoadingMessage(false);
    setIsLoading(false);
  };

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );

  useEffect(() => {
    setTimeout(() => {
      setPageAnimOn(true);
    }, 250);
  });

  const location = useLocation();

  const [threads, setThread] = useState(() => {
      const savedTodos = localStorage.getItem("threads");
      if (savedTodos) {
        return JSON.parse(savedTodos);
      } else {
        return [
          {
            id: 'default',
            title: 'Default thread',
            answers: []
          }
        ];
      }
  });

  const saveThreads = (answers: any[]) => {
    const threads = JSON.parse(localStorage.getItem('threads'));
    if (threads) {
      const newThreads = threads.map((obj: any) => {
        if (obj.id === threadId) {
          return {...obj, answers};
        }
        return obj;
      });

      setThread(newThreads);
      localStorage.setItem('threads', JSON.stringify(newThreads));
    }
  };

  useEffect(() => {
    const threads = JSON.parse(localStorage.getItem('threads'));
    if (threads) {
      setThread(threads);
    }
  }, []);

  useEffect(() => {
    if(threadId) {
      const threads = JSON.parse(localStorage.getItem('threads'));
      if (threads) {
        const newAnswers = threads.find((item: any) => item.id === threadId);
        setAnswers(newAnswers?.answers);
        const question = newAnswers?.answers[newAnswers?.answers?.length - 1]
        lastQuestionRef.current = question?.content || '';
      }
    } else {
      clearChat();
    }
  }, [location.pathname]);

  const onShowCitation = (citation: Citation) => {
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

  const parseCitationFromMessage = (message: ChatMessage) => {
    if (message.role === "tool") {
      try {
        const toolMessage = JSON.parse(message.content) as ToolMessageContent;
        return toolMessage.citations;
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div
      className={`
      ${styles.container}
      ${pageAnimOn ? styles.pageAnimOn : ""}
      ${pageAnimOff ? styles.pageAnimOff : ""}
    `}
    >
      <Sidebar data={threads} threadId={threadId} />

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
              onMicrophoneClick={onMicrophoneClick}
              onStopClick={stopSpeechRecognition}
              isListening={isListening}
              isRecognizing={isRecognizing}
              setRecognizedText={setRecognizedText}
              onClearChat={onClearChat}
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
  );
};

export default Chat;
