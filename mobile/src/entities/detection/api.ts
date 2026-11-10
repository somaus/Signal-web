import { api } from "@/shared/api/axios";
import { guestHeaders } from "@/shared/api/guestHeaders";
import { imageForm, uploadConfig } from "@/shared/api/imageForm";
import type { PickedImage } from "@/shared/lib/pickImage";

export type ProcessingStatus = "PROCESSING" | "COMPLETED" | "FAILED";
export type DeepfakeVerdict = "REAL" | "FAKE" | "SUSPICIOUS";
export const DEEPFAKE_BANDS = ["LOW", "UNCERTAIN", "HIGH", "UNDETERMINED"] as const;
export type DeepfakeBand = (typeof DEEPFAKE_BANDS)[number];
export type AssessmentBasis = "MODEL" | "PROVENANCE";
export type DetectionFailureReason =
  "NO_FACE_DETECTED" | "VIDEO_NOT_SUPPORTED" | "AI_SERVER_ERROR" | "TIMEOUT";

export interface EvidenceResponse {
  type: string;
  description: string;
}

export interface ProvenanceSignalResponse {
  code: string;
  message?: string;
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
  /** 판단 불가 등이면 null. */
  riskScore?: number | null;
  evidences?: EvidenceResponse[];
  /** true면 실제 AI 분석이 아니라 서버가 대신 채운 참고용 추정치다. */
  fallbackUsed?: boolean | null;
  failureReason?: DetectionFailureReason | null;
  band?: string | null;
  assessmentBasis?: AssessmentBasis | null;
  undeterminedReason?: string | null;
  modelName?: string | null;
  modelVersion?: string | null;
  provenanceSignals?: ProvenanceSignalResponse[];
}

export function isDeepfakeBand(value: string | null | undefined): value is DeepfakeBand {
  return DEEPFAKE_BANDS.some((band) => band === value);
}

export async function createDeepfakeDetection(
  image: PickedImage,
): Promise<DeepfakeDetectionCreateResponse> {
  const { data } = await api.post<DeepfakeDetectionCreateResponse>(
    "/api/v1/deepfake-detections",
    imageForm("file", image),
    await uploadConfig(),
  );
  return data;
}

export async function getDeepfakeDetection(
  detectionId: number,
): Promise<DeepfakeDetectionResponse> {
  const { data } = await api.get<DeepfakeDetectionResponse>(
    `/api/v1/deepfake-detections/${detectionId}`,
    { headers: await guestHeaders() },
  );
  return data;
}
