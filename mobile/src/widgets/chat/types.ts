export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  /** 사용자 메시지의 전송 상태. 보내기를 마치면 비운다. */
  status?: "sending" | "failed";
  /** 전송에 실패했을 때 보여줄 이유(ApiError 메시지). */
  error?: string;
  /** 서버가 전문 기관 연결을 추천한 답변. */
  hasAgencies?: boolean;
  /** 서버가 상담을 마무리한 답변. */
  endsSession?: boolean;
}
