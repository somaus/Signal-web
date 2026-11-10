import type { CreateReportRequest, UpdateReportRequest } from "@/entities/report/model";

export const damageTypes = ["faceTheft", "harassment", "privacyLeak", "deepfake"] as const;
export type DamageType = (typeof damageTypes)[number];

/** 서버에 올린 증거 파일. */
export interface UploadedEvidence {
  id: number;
  name: string;
}

export interface ReportForm {
  incidentDate: string;
  platform: string;
  url: string;
  description: string;
  additionalNotes: string;
}

export const emptyForm: ReportForm = {
  incidentDate: "",
  platform: "",
  url: "",
  description: "",
  additionalNotes: "",
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** 비어 있거나 "2026-11-09"처럼 실제로 있는 오늘 이전 날짜면 true. */
export function isValidIncidentDate(value: string, today = new Date()): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const match = DATE_PATTERN.exec(trimmed);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate && date.getTime() <= today.getTime();
}

/** "instagram.com/abc"처럼 주소만 적어도 https://를 붙여서 받는다. */
export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isValidUrl(value: string): boolean {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;
  try {
    const url = new URL(normalized);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export type FormErrors = Partial<Record<"incidentDate" | "url" | "description", string>>;

/** 서버는 피해 내용과 원본 URL이 있어야 신고서를 만든다. */
export function validateForm(
  form: ReportForm,
  messages: {
    invalidDate: string;
    urlRequired: string;
    invalidUrl: string;
    descriptionRequired: string;
  },
): FormErrors {
  const errors: FormErrors = {};
  if (!isValidIncidentDate(form.incidentDate)) errors.incidentDate = messages.invalidDate;
  if (!form.url.trim()) errors.url = messages.urlRequired;
  else if (!isValidUrl(form.url)) errors.url = messages.invalidUrl;
  if (!form.description.trim()) errors.description = messages.descriptionRequired;
  return errors;
}

function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * @param damageLabel 웹과 같이 화면에 보이는 피해 유형 이름을 그대로 보낸다.
 */
export function toCreateRequest(
  damageLabel: string,
  form: ReportForm,
  evidence: UploadedEvidence | null,
): CreateReportRequest {
  const url = normalizeUrl(form.url);
  return {
    damageType: optional(damageLabel),
    incidentDate: optional(form.incidentDate),
    discoveryRoute: optional(form.platform),
    description: optional(form.description),
    additionalNotes: optional(form.additionalNotes),
    sourceUrls: url ? [url] : undefined,
    evidenceIds: evidence ? [evidence.id] : undefined,
  };
}

/** 비운 항목은 null로 보내서 서버에서도 지워지게 한다(웹과 같다). */
export function toUpdateRequest(
  damageLabel: string,
  form: ReportForm,
  evidence: UploadedEvidence | null,
): UpdateReportRequest {
  const created = toCreateRequest(damageLabel, form, evidence);
  return {
    damageType: created.damageType ?? null,
    incidentDate: created.incidentDate ?? null,
    discoveryRoute: created.discoveryRoute ?? null,
    description: created.description ?? null,
    additionalNotes: created.additionalNotes ?? null,
    sourceUrls: created.sourceUrls ?? [],
    evidenceIds: created.evidenceIds ?? [],
  };
}
