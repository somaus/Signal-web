// 서버 응답 모양. 웹(Signal-web/src/entities/chat/api.ts)과 같다.

export interface ChatSessionCreateResponse {
  sessionId: string;
  createdAt: string;
}

export interface ChatSessionResponse {
  sessionId: string;
  saveConsent?: boolean;
  createdAt: string;
}

export type ChatMessageRole = "USER" | "BOT";

export interface ChatMessageResponse {
  role: ChatMessageRole;
  content: string;
  createdAt: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessageResponse[];
}

export type ChatSituationType = "GENERAL" | "IMAGE_ABUSE";

export type ConsultationStageCode =
  | "SITUATION_CHECK"
  | "EMOTIONAL_SUPPORT"
  | "EVIDENCE_PRESERVATION"
  | "PLATFORM_REPORT"
  | "AGENCY_GUIDANCE";

export interface ConsultationStage {
  stage: string;
  label: string;
  status: string;
}

export interface ConsultationProgressResponse {
  status: string;
  currentStage: string;
  completedStages: string[];
  stages: ConsultationStage[];
  progressPercent: number;
  completedCount?: number;
  totalCount?: number;
}

export interface SendMessageResponse {
  messageId: number;
  reply: string;
  situationType?: ChatSituationType;
  suggestedActions?: string[];
  crisisDetected?: boolean;
  recommendedAgencies?: string[];
  sessionEnded?: boolean;
  progress?: ConsultationProgressResponse;
}

export interface ChatSummaryResponse {
  situation: string;
  recommendedSteps: string[];
  recommendedStepCodes?: ConsultationStageCode[];
  riskLevel: string;
  riskDescription: string;
  progressPercent: number;
  progress: ConsultationProgressResponse;
}
