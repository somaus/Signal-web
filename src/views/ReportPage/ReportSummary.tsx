"use client";

import { useT } from "@/shared/i18n/I18nProvider";
import { reportDocumentMessages } from "./reportDocumentMessages";

interface ReportSummaryProps {
  summary: string | null | undefined;
  className?: string;
}

/** AI가 만든 사건 개요. 요약이 없으면(원문이 짧거나 만들지 못함) 아무것도 그리지 않는다. */
export default function ReportSummary({ summary, className = "" }: ReportSummaryProps) {
  const t = useT(reportDocumentMessages);
  if (!summary?.trim()) return null;

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-lg border border-gray-300 p-3 md:p-4 ${className}`}
    >
      <p className="text-body-2 md:text-body-1 font-semibold text-black">{t.summaryTitle}</p>
      <p className="text-body-2 md:text-body-1 w-full break-words whitespace-pre-wrap text-black">
        {summary}
      </p>
      <p className="text-small text-gray-650">{t.summaryNotice}</p>
    </div>
  );
}
