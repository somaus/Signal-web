import { useCallback, useRef, useState } from "react";
import { createChatSession, getChatSummary, sendChatMessage } from "@/entities/chat/api";
import type {
  ChatMessageResponse,
  ChatSituationType,
  ChatSummaryResponse,
  ConsultationProgressResponse,
  SendMessageResponse,
} from "@/entities/chat/model";
import { useMessages } from "@/shared/i18n/I18nProvider";
import type { ChatMessage } from "@/widgets/chat/types";
import { chatMessages } from "./messages";

/** 보내기 응답에는 진행도만 있어서, 요약 API 응답이 오기 전까지 이 모양으로 먼저 보여준다. */
export type ChatSummary = Partial<ChatSummaryResponse> & {
  progress?: ConsultationProgressResponse;
};

let messageIdCounter = 0;

function createMessageId() {
  messageIdCounter += 1;
  return String(messageIdCounter);
}

function mapChatSummary(
  response: SendMessageResponse,
  labels: { imageAbuse: string; general: string },
): ChatSummary | null {
  if (!response.progress) return null;
  return {
    situation: response.situationType
      ? response.situationType === "IMAGE_ABUSE"
        ? labels.imageAbuse
        : labels.general
      : undefined,
    recommendedSteps: response.suggestedActions ?? [],
    progress: response.progress,
  };
}

function errorText(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

/**
 * 상담 한 건의 상태. 서버 응답을 그대로 이어 붙이고, 인사말은 화면에서 따로 그린다.
 * @param canSave 로그인했을 때만 true. 비회원은 대화를 저장할 수 없다.
 */
export function useChatSession(canSave: boolean, options: { onCrisis?: () => void } = {}) {
  const t = useMessages(chatMessages);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<ChatSummary | null>(null);
  const [summaryFailed, setSummaryFailed] = useState(false);
  const [situationType, setSituationType] = useState<ChatSituationType | undefined>();
  const [isSending, setIsSending] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  /** 이어서 불러온 이전 상담의 세션 ID. 같은 상담을 두 번 불러오지 않게 화면이 확인한다. */
  const [resumedId, setResumedId] = useState<string | null>(null);
  const [saveConsent, setSaveConsent] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const sessionCreatingRef = useRef<Promise<string> | null>(null);
  const sendingRef = useRef(false);
  // 새 상담을 시작하거나 이어가면 1 올려서, 이전 요청의 늦은 응답을 버린다.
  const generationRef = useRef(0);
  const effectiveConsent = canSave && saveConsent;
  const isClosing = messages.some((message) => message.endsSession);

  function ensureSession(): Promise<string> {
    if (sessionIdRef.current) return Promise.resolve(sessionIdRef.current);
    const generation = generationRef.current;
    sessionCreatingRef.current ??= createChatSession(effectiveConsent)
      .then((session) => {
        if (generation === generationRef.current) sessionIdRef.current = session.sessionId;
        return session.sessionId;
      })
      .finally(() => {
        sessionCreatingRef.current = null;
      });
    return sessionCreatingRef.current;
  }

  const clearConversation = useCallback(() => {
    generationRef.current += 1;
    sessionIdRef.current = null;
    sessionCreatingRef.current = null;
    sendingRef.current = false;
    setIsSending(false);
    setMessages([]);
    setSummary(null);
    setSummaryFailed(false);
    setSituationType(undefined);
    setCrisisDetected(false);
    setResumedId(null);
  }, []);

  /** 새 상담을 시작한다. */
  const reset = useCallback(() => {
    clearConversation();
    setSaveConsent(false);
  }, [clearConversation]);

  /** 이전 상담을 불러와 같은 세션에서 이어서 대화한다. */
  const resume = useCallback(
    async (sessionId: string, history: ChatMessageResponse[]) => {
      clearConversation();
      sessionIdRef.current = sessionId;
      setResumedId(sessionId);
      setMessages(
        history.map((item) => ({
          id: createMessageId(),
          role: item.role === "USER" ? "user" : "bot",
          content: item.content,
        })),
      );
      const generation = generationRef.current;
      try {
        const latest = await getChatSummary(sessionId);
        if (generation === generationRef.current) setSummary(latest);
      } catch {
        // 요약이 없어도 대화는 이어갈 수 있다.
      }
    },
    [clearConversation],
  );

  /** retryId가 있으면 실패한 메시지를 새로 만들지 않고 같은 말풍선을 다시 보낸다. */
  async function send(content: string, retryId?: string) {
    const trimmed = content.trim();
    if (!trimmed || sendingRef.current || isClosing) return;

    const userMessageId = retryId ?? createMessageId();
    setMessages((prev) =>
      retryId
        ? prev.map((message) =>
            message.id === retryId ? { ...message, status: "sending", error: undefined } : message,
          )
        : [...prev, { id: userMessageId, role: "user", content: trimmed, status: "sending" }],
    );
    sendingRef.current = true;
    setIsSending(true);
    const generation = generationRef.current;
    const isStale = () => generation !== generationRef.current;

    try {
      const sessionId = await ensureSession();
      const response = await sendChatMessage(sessionId, trimmed);
      if (isStale()) return;
      setMessages((prev) => [
        ...prev.map((message) =>
          message.id === userMessageId ? { ...message, status: undefined } : message,
        ),
        {
          id: createMessageId(),
          role: "bot",
          content: response.reply,
          hasAgencies: (response.recommendedAgencies?.length ?? 0) > 0,
          endsSession: response.sessionEnded === true,
        },
      ]);
      if (response.situationType) setSituationType(response.situationType);
      // 진행도가 없는 응답이면 이전 요약을 그대로 둔다.
      const quickSummary = mapChatSummary(response, t.summary);
      if (quickSummary) setSummary(quickSummary);
      if (response.crisisDetected) {
        setCrisisDetected(true);
        options.onCrisis?.();
      }
      try {
        const latest = await getChatSummary(sessionId);
        if (!isStale()) {
          setSummary(latest);
          setSummaryFailed(false);
        }
      } catch {
        if (!isStale()) setSummaryFailed(true);
      }
    } catch (error) {
      if (isStale()) return;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === userMessageId
            ? { ...message, status: "failed", error: errorText(error) }
            : message,
        ),
      );
    } finally {
      if (!isStale()) {
        sendingRef.current = false;
        setIsSending(false);
      }
    }
  }

  return {
    messages,
    summary,
    summaryFailed,
    situationType,
    isSending,
    isClosing,
    crisisDetected,
    resumedId,
    hasStarted: messages.length > 0,
    saveConsent: effectiveConsent,
    setSaveConsent,
    send,
    reset,
    resume,
  };
}
