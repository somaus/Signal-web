import { api } from "@/shared/api/axios";
import type { ProtectionCreateResponse, ProtectionLevel, ProtectionResponse } from "./model";

// 보호 처리는 로그인이 필요하다. 위험도 분석을 먼저 끝낸 사진(assessmentId)에만 쓸 수 있다.

export async function createProtection(
  assessmentId: number,
  protectionLevel: ProtectionLevel,
): Promise<ProtectionCreateResponse> {
  const { data } = await api.post<ProtectionCreateResponse>("/api/v1/protections", {
    assessmentId,
    protectionLevel,
  });
  return data;
}

export async function getProtection(protectionId: number): Promise<ProtectionResponse> {
  const { data } = await api.get<ProtectionResponse>(`/api/v1/protections/${protectionId}`);
  return data;
}

/** 보호된 이미지(PNG) 경로. 로그인이 필요해 링크로 열 수 없고 파일로 받아야 한다. */
export function protectionDownloadPath(protectionId: number): string {
  return `/api/v1/protections/${protectionId}/download`;
}
