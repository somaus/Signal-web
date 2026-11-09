import type { RiskAssessmentResponse } from "@/entities/analysis/api";

export type Status = "idle" | "selected" | "analyzing" | "error" | "result";

export interface AnalyzeSession {
  status: Status;
  previewUrl: string | null;
  selectedFile: File | null;
  showDetails: boolean;
  isProtected: boolean;
  isSimulatedProtection: boolean;
  assessment: RiskAssessmentResponse | null;
  assessmentId: number | null;
  protectionId: number | null;
}

export const EMPTY_SESSION: AnalyzeSession = {
  status: "idle",
  previewUrl: null,
  selectedFile: null,
  showDetails: false,
  isProtected: false,
  isSimulatedProtection: false,
  assessment: null,
  assessmentId: null,
  protectionId: null,
};

let saved: AnalyzeSession = EMPTY_SESSION;

export function loadAnalyzeSession(): AnalyzeSession {
  return saved.status === "analyzing" && saved.assessmentId === null
    ? { ...saved, status: "selected" }
    : saved;
}

export function saveAnalyzeSession(session: AnalyzeSession) {
  saved = session;
}
