export type SituationType = "DEEPFAKE_IMAGE" | "IMAGE_ABUSE" | "CRISIS";

export type ConnectionType = "PHONE" | "WEB" | "DOCUMENT_SUBMIT";

export interface AgencyResponse {
  agencyId: number;
  name: string;
  phone?: string;
  website?: string;
  availableHours?: string;
  supportedActions?: string[];
}

export interface CreateConnectionRequest {
  reportId?: number;
  connectionType: ConnectionType;
}

export interface ConnectionResponse {
  connectionId: number;
  agencyName: string;
  connectionType: ConnectionType;
  phone?: string;
  attachedReportUrl?: string;
}
