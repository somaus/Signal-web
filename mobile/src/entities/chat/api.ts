import { api } from "@/shared/api/axios";
import { guestHeaders } from "@/shared/api/guestHeaders";
import type {
  ChatMessagesResponse,
  ChatSessionCreateResponse,
  ChatSessionResponse,
  ChatSummaryResponse,
  SendMessageResponse,
} from "./model";

/** AI 답변은 일반 요청보다 오래 걸릴 수 있어 기본 10초보다 길게 기다린다. */
const REPLY_TIMEOUT_MS = 40_000;

export async function createChatSession(saveConsent = false): Promise<ChatSessionCreateResponse> {
  const { data } = await api.post<ChatSessionCreateResponse>(
    "/api/v1/chat/sessions",
    { saveConsent },
    { headers: await guestHeaders() },
  );
  return data;
}

export async function sendChatMessage(
  sessionId: string,
  content: string,
): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>(
    `/api/v1/chat/sessions/${sessionId}/messages`,
    { content },
    { headers: await guestHeaders(), timeout: REPLY_TIMEOUT_MS },
  );
  return data;
}

export async function getChatSummary(sessionId: string): Promise<ChatSummaryResponse> {
  const { data } = await api.get<ChatSummaryResponse>(
    `/api/v1/chat/sessions/${sessionId}/summary`,
    { headers: await guestHeaders() },
  );
  return data;
}

/** 로그인이 필요하다. */
export async function getMyChatSessions(): Promise<ChatSessionResponse[]> {
  const { data } = await api.get<ChatSessionResponse[]>("/api/v1/chat/sessions");
  return data;
}

export async function getChatSessionMessages(sessionId: string): Promise<ChatMessagesResponse> {
  const { data } = await api.get<ChatMessagesResponse>(
    `/api/v1/chat/sessions/${sessionId}/messages`,
    { headers: await guestHeaders() },
  );
  return data;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await api.delete(`/api/v1/chat/sessions/${sessionId}`, { headers: await guestHeaders() });
}
