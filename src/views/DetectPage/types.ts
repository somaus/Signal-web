import type { DeepfakeBand, DeepfakeVerdict } from "./detectApi";

export type DetectStatus = "idle" | "selected" | "analyzing" | "result";

export interface DetectResult {
  faceTheftVerdict: string;
  faceTheftScore: number;
  faceTheftCaption: string;
  deepfakeVerdict: string;
  /** 합성 가능성(0~100). 서버가 riskScore를 주지 않으면 null. 모델 확신도로 대신 채우지 않는다. */
  deepfakeRiskScore: number | null;
  /** 판정 코드. 딥페이크 카드와 종합 위험도 게이지의 색을 점수 크기가 아니라 판정으로 정한다. */
  deepfakeTone?: DeepfakeVerdict;
  deepfakeBand: DeepfakeBand | null;
  deepfakeCaption: string;
  overallScore: number | null;
  overallCaption: string;
  modelConfidence: number;
  modelConfidenceNote: string;
  fallbackUsed: boolean;
  modelLabel: string | null;
  evidenceHighlights: { tab: string; description: string }[];
  webMatchCount: number;
}
