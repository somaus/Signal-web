"use client";

import { useT } from "@/shared/i18n/I18nProvider";
import ReportDocumentDownloadButton from "@/views/ReportPage/ReportDocumentDownloadButton";
import { referralMessages } from "./messages";

interface AttachedReportCardProps {
  reportId: number;
}

export default function AttachedReportCard({ reportId }: AttachedReportCardProps) {
  const t = useT(referralMessages);

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-300 p-5 sm:flex-row sm:items-center md:p-6">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-large md:text-h3 font-semibold text-black">{t.attachedTitle}</p>
        <p className="text-small md:text-large break-keep text-gray-700">{t.attachedDescription}</p>
      </div>
      <ReportDocumentDownloadButton reportId={reportId} className="w-full shrink-0 sm:w-auto" />
    </div>
  );
}
