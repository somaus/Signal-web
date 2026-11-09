// 서버 응답 모양. 웹(Signal-web/src/entities/report/api.ts)과 같다.

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
  /** 서버 필수 항목. */
  description?: string;
  /** 서버 필수 항목. 하나 이상 있어야 한다. */
  sourceUrls?: string[];
  evidenceIds?: number[];
  targetAgencyType?: string;
  additionalNotes?: string;
}

/** 값에 null을 보내면 서버가 그 항목을 지운다. */
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
  /** 신고 문서(PDF) API 경로. 로그인이 필요해 링크로 열 수 없고 파일로 받아야 한다. */
  documentUrl?: string;
  timeline: ReportTimelineEntry[];
  createdAt: string;
}

export interface ReportEvidenceResponse {
  evidenceId: number;
  fileUrl: string;
}

/** 기기에서 고른 증거 파일. */
export interface EvidenceFile {
  uri: string;
  name: string;
  mimeType: string;
}
