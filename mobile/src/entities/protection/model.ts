// 서버 응답 모양. 웹(Signal-web/src/views/AnalyzePage/analyzeApi.ts)과 같다.

export const protectionLevels = ["LIGHT", "NORMAL", "STRONG"] as const;
export type ProtectionLevel = (typeof protectionLevels)[number];
export type ProtectionStatus = "PROCESSING" | "COMPLETED" | "FAILED";

export interface ProtectionCreateResponse {
  protectionId: number;
  status: ProtectionStatus;
}

export interface ProtectionResponse {
  protectionId: number;
  status: ProtectionStatus;
  originalImageUrl?: string;
  protectedImageUrl?: string;
  visualDifference?: number;
  /** true면 시연용 단계라 실제 노이즈 없이 원본 사본을 돌려준다. */
  simulated?: boolean;
}
