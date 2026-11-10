import { api } from "@/shared/api/axios";
import type {
  CreateReportRequest,
  EvidenceFile,
  ReportEvidenceResponse,
  ReportResponse,
  ReportStatusResponse,
  UpdateReportRequest,
} from "./model";

// 신고 API는 모두 로그인이 필요하다(비회원 헤더를 쓰지 않는다).

/** 신고서를 만들거나 고칠 때 서버가 AI 요약을 같이 만들어서 기본 10초보다 오래 걸릴 수 있다. */
const SUMMARY_TIMEOUT_MS = 40_000;
/** 증거 파일은 최대 20MB라 업로드를 넉넉히 기다린다. */
const UPLOAD_TIMEOUT_MS = 60_000;

export async function getMyReports(): Promise<ReportResponse[]> {
  const { data } = await api.get<ReportResponse[]>("/api/v1/reports");
  return data;
}

export async function createReport(payload: CreateReportRequest): Promise<ReportStatusResponse> {
  const { data } = await api.post<ReportStatusResponse>("/api/v1/reports", payload, {
    timeout: SUMMARY_TIMEOUT_MS,
  });
  return data;
}

export async function getReport(reportId: number): Promise<ReportResponse> {
  const { data } = await api.get<ReportResponse>(`/api/v1/reports/${reportId}`);
  return data;
}

export async function updateReport(
  reportId: number,
  payload: UpdateReportRequest,
): Promise<ReportResponse> {
  const { data } = await api.patch<ReportResponse>(`/api/v1/reports/${reportId}`, payload, {
    timeout: SUMMARY_TIMEOUT_MS,
  });
  return data;
}

export async function finalizeReport(reportId: number): Promise<ReportStatusResponse> {
  const { data } = await api.post<ReportStatusResponse>(
    `/api/v1/reports/${reportId}/finalize`,
    undefined,
    { timeout: SUMMARY_TIMEOUT_MS },
  );
  return data;
}

export async function deleteReport(reportId: number): Promise<void> {
  await api.delete(`/api/v1/reports/${reportId}`);
}

export async function uploadReportEvidence(file: EvidenceFile): Promise<ReportEvidenceResponse> {
  const formData = new FormData();
  // React Native의 FormData는 파일을 { uri, name, type }로 받는다.
  // 타입 정의는 브라우저 FormData(Blob만 받음)로 잡혀 있어서 모양만 맞춰 넘긴다.
  const part = { uri: file.uri, name: file.name, type: file.mimeType } as unknown as Blob;
  formData.append("file", part);
  const { data } = await api.post<ReportEvidenceResponse>("/api/v1/reports/evidence", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // axios가 FormData를 다른 형태로 바꾸지 않게 그대로 넘긴다.
    transformRequest: (body) => body,
    timeout: UPLOAD_TIMEOUT_MS,
  });
  return data;
}

/** PDF 경로. 파일 내려받기는 axios가 아니라 기기 파일 시스템으로 받는다(useReportDocument). */
export function reportDocumentPath(reportId: number): string {
  return `/api/v1/reports/${reportId}/document`;
}
