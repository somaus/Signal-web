import { api } from "@/shared/api/axios";

export type ReportDocumentStatus = "DRAFT" | "FINALIZED";
export type ReportTimelineEvent = "CREATED" | "UPDATED" | "FINALIZED";

export interface ReportTimelineEntry {
  event: ReportTimelineEvent;
  occurredAt: string;
}

export interface CreateReportRequest {
  incidentDate?: string;
  discoveryRoute?: string;
  damageType?: string;
  description?: string;
  sourceUrls?: string[];
  evidenceIds?: number[];
  targetAgencyType?: string;
  additionalNotes?: string;
}

export type UpdateReportRequest = {
  [Key in keyof CreateReportRequest]?: CreateReportRequest[Key] | null;
};

export interface ReportStatusResponse {
  reportId: number;
  status: ReportDocumentStatus;
  documentUrl?: string;
}

export interface ReportResponse {
  reportId: number;
  status: ReportDocumentStatus;
  incidentDate?: string;
  discoveryRoute?: string;
  damageType?: string;
  description?: string;
  /** AI가 원문을 요약한 사건 개요. 원문이 짧거나 요약을 만들지 못하면 없다. */
  summary?: string | null;
  sourceUrls?: string[];
  evidenceIds?: number[];
  targetAgencyType?: string;
  additionalNotes?: string;
  /** 신고 문서(PDF)를 받는 API 경로. 로그인이 필요해 링크로 열 수 없고 downloadReportDocument로 받는다. */
  documentUrl?: string;
  timeline: ReportTimelineEntry[];
  createdAt: string;
}

export interface ReportEvidenceResponse {
  evidenceId: number;
  fileUrl: string;
}

export async function getMyReports(): Promise<ReportResponse[]> {
  const { data } = await api.get<ReportResponse[]>("/api/v1/reports");
  return data;
}

export async function createReport(payload: CreateReportRequest): Promise<ReportStatusResponse> {
  const { data } = await api.post<ReportStatusResponse>("/api/v1/reports", payload);
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
  const { data } = await api.patch<ReportResponse>(`/api/v1/reports/${reportId}`, payload);
  return data;
}

export async function downloadReportDocument(reportId: number): Promise<Blob> {
  const { data } = await api.get<Blob>(`/api/v1/reports/${reportId}/document`, {
    responseType: "blob",
  });
  return data;
}

export async function finalizeReport(reportId: number): Promise<ReportStatusResponse> {
  const { data } = await api.post<ReportStatusResponse>(`/api/v1/reports/${reportId}/finalize`);
  return data;
}

export async function deleteReport(reportId: number): Promise<void> {
  await api.delete(`/api/v1/reports/${reportId}`);
}

export async function uploadReportEvidence(file: File): Promise<ReportEvidenceResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<ReportEvidenceResponse>("/api/v1/reports/evidence", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
