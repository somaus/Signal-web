import { api } from "@/shared/api/axios";
import { guestHeaders } from "@/shared/api/guestHeaders";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type AssessmentStatus = "PROCESSING" | "COMPLETED" | "FAILED";

export interface RiskFactorResponse {
  type: string;
  label: string;
  score: number;
  description: string;
}

export interface BoundingBoxResponse {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FaceResponse =
  | { index: number; positionKnown?: true; boundingBox: BoundingBoxResponse }
  | { index: number; positionKnown: false; boundingBox: null };

export interface RiskAssessmentResponse {
  assessmentId: number;
  overallRiskLevel: RiskLevel | null;
  overallScore: number | null;
  factors: RiskFactorResponse[];
  recommendations: string[];
  faceDetected: boolean;
  faces: FaceResponse[];
  /** true면 실제 AI 분석이 아니라 서버가 자동으로 대체한 참고용 추정치(폴백)입니다. */
  fallbackUsed: boolean;
  status?: AssessmentStatus;
  failureReason?: string | null;
}

export type CompletedAssessment = RiskAssessmentResponse & {
  overallRiskLevel: RiskLevel;
  overallScore: number;
};

export function isCompletedAssessment(data: RiskAssessmentResponse): data is CompletedAssessment {
  return (
    (data.status === undefined || data.status === "COMPLETED") &&
    data.overallRiskLevel !== null &&
    data.overallScore !== null
  );
}

export async function createRiskAssessment(file: File): Promise<RiskAssessmentResponse> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post<RiskAssessmentResponse>("/api/v1/risk-assessments", formData, {
    headers: { "Content-Type": "multipart/form-data", ...guestHeaders() },
    timeout: 60_000,
  });
  return data;
}

export async function getMyAssessments(): Promise<RiskAssessmentResponse[]> {
  const { data } = await api.get<RiskAssessmentResponse[]>("/api/v1/risk-assessments");
  return data;
}

export async function getAssessment(assessmentId: number): Promise<RiskAssessmentResponse> {
  const { data } = await api.get<RiskAssessmentResponse>(
    `/api/v1/risk-assessments/${assessmentId}`,
    { headers: guestHeaders() },
  );
  return data;
}
