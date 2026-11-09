import { api } from "@/shared/api/axios";
import { guestHeaders } from "@/shared/api/guestHeaders";
import { imageForm, uploadConfig } from "@/shared/api/imageForm";
import type { PickedImage } from "@/shared/lib/pickImage";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type AssessmentStatus = "PROCESSING" | "COMPLETED" | "FAILED";
export type AssessmentFailureReason =
  "NO_FACE_DETECTED" | "AI_SERVER_ERROR" | "TIMEOUT" | "INVALID_IMAGE";

export interface RiskFactorResponse {
  type: string;
  label: string;
  score: number;
  description: string;
}

/** 서버는 접수 직후(PROCESSING)에 결과 필드를 비워 보낸다. */
export interface RiskAssessmentResponse {
  assessmentId: number;
  status: AssessmentStatus;
  failureReason: AssessmentFailureReason | null;
  overallRiskLevel: RiskLevel | null;
  overallScore: number | null;
  factors: RiskFactorResponse[];
  recommendations: string[];
  faceDetected: boolean;
  /** true면 실제 AI 분석이 아니라 서버가 대신 채운 참고용 추정치다. */
  fallbackUsed: boolean;
}

export async function createRiskAssessment(image: PickedImage): Promise<RiskAssessmentResponse> {
  const { data } = await api.post<RiskAssessmentResponse>(
    "/api/v1/risk-assessments",
    imageForm("image", image),
    await uploadConfig(),
  );
  return data;
}

/** 로그인한 사용자의 완료된 분석 목록. */
export async function getMyAssessments(): Promise<RiskAssessmentResponse[]> {
  const { data } = await api.get<RiskAssessmentResponse[]>("/api/v1/risk-assessments");
  return data;
}

export async function getAssessment(assessmentId: number): Promise<RiskAssessmentResponse> {
  const { data } = await api.get<RiskAssessmentResponse>(
    `/api/v1/risk-assessments/${assessmentId}`,
    { headers: await guestHeaders() },
  );
  return data;
}
