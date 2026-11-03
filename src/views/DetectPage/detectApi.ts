import { api } from "@/shared/api/axios";
import { guestHeaders } from "@/shared/api/guestHeaders";
import type { WebMatchType } from "@/shared/lib/webMatch";

export type ProcessingStatus = "PROCESSING" | "COMPLETED" | "FAILED";
export type DeepfakeVerdict = "REAL" | "FAKE" | "SUSPICIOUS";
export const DEEPFAKE_BANDS = ["LOW", "UNCERTAIN", "HIGH", "UNDETERMINED"] as const;
export type DeepfakeBand = (typeof DEEPFAKE_BANDS)[number];
export type AssessmentBasis = "MODEL" | "PROVENANCE";
export type DetectionFailureReason =
  | "NO_FACE_DETECTED"
  | "VIDEO_NOT_SUPPORTED"
  | "AI_SERVER_ERROR"
  | "TIMEOUT";

export interface RegionResponse {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EvidenceResponse {
  type: string;
  description: string;
  region?: RegionResponse;
  frame?: number;
}

export type WebSearchStatus = "PROCESSING" | "COMPLETED" | "FAILED" | "UNAVAILABLE";
export type WebSearchUnavailableReason = "VIDEO" | "OWNER_LIMIT" | "DAILY_LIMIT" | "MONTHLY_LIMIT";

export interface WebMatchResponse {
  pageUrl: string;
  domain?: string | null;
  title?: string | null;
  matchType: WebMatchType;
}

export interface WebSearchResponse {
  status: WebSearchStatus;
  unavailableReason?: WebSearchUnavailableReason | null;
  matchCount: number;
  matches: WebMatchResponse[];
}

export interface ProvenanceSignalResponse {
  code: string;
  message?: string;
  strong?: boolean;
}

export interface DeepfakeDetectionCreateResponse {
  detectionId: number;
  status: ProcessingStatus;
}

export interface DeepfakeDetectionResponse {
  detectionId: number;
  status: ProcessingStatus;
  verdict?: DeepfakeVerdict | null;
  confidence?: number | null;
  /** 전용 탐지 모델 모드에서 판단 불가 등이면 null. */
  riskScore?: number | null;
  evidences?: EvidenceResponse[];
  highlightedResultUrl?: string;
  /** true면 실제 AI 분석이 아니라 서버가 자동으로 대체한 참고용 추정치(폴백)입니다. */
  fallbackUsed?: boolean;
  failureReason?: DetectionFailureReason | null;
  band?: string | null;
  assessmentBasis?: AssessmentBasis | null;
  undeterminedReason?: string | null;
  modelName?: string | null;
  modelVersion?: string | null;
  provenanceSignals?: ProvenanceSignalResponse[];
  webSearch?: WebSearchResponse | null;
}

export function isDeepfakeBand(value: string | null | undefined): value is DeepfakeBand {
  return DEEPFAKE_BANDS.some((band) => band === value);
}

export async function createDeepfakeDetection(
  file: File,
): Promise<DeepfakeDetectionCreateResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<DeepfakeDetectionCreateResponse>(
    "/api/v1/deepfake-detections",
    formData,
    { headers: { "Content-Type": "multipart/form-data", ...guestHeaders() } },
  );
  return data;
}

export async function getDeepfakeDetection(
  detectionId: number,
): Promise<DeepfakeDetectionResponse> {
  const { data } = await api.get<DeepfakeDetectionResponse>(
    `/api/v1/deepfake-detections/${detectionId}`,
    { headers: guestHeaders() },
  );
  return data;
}

export async function startWebSearch(detectionId: number): Promise<WebSearchResponse> {
  const { data } = await api.post<WebSearchResponse>(
    `/api/v1/deepfake-detections/${detectionId}/web-search`,
    undefined,
    { headers: guestHeaders() },
  );
  return data;
}
