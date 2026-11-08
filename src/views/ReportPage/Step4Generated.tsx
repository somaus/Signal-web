"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getReport } from "@/entities/report/api";
import Button, { buttonStyle } from "@/shared/ui/Button";
import DraftCardHeader from "./DraftCardHeader";
import StepNavigation from "./StepNavigation";
import type { ReportEvidence } from "./Step2Details";
import type { ReportDraft } from "./reportDraft";
import { useLocale, useT } from "@/shared/i18n/I18nProvider";
import { formatDateLong } from "@/shared/i18n/format";
import { reportMessages } from "./messages";
import ReportDocumentDownloadButton from "./ReportDocumentDownloadButton";
import ReportSummary from "./ReportSummary";

interface Step4GeneratedProps {
  draft: ReportDraft;
  evidence: ReportEvidence | null;
  reportId: number;
  onBack: () => void;
  onFindAgency: () => void;
}

function toHref(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function Step4Generated({
  draft,
  evidence,
  reportId,
  onBack,
  onFindAgency,
}: Step4GeneratedProps) {
  const { draft: d } = useT(reportMessages);
  const { locale } = useLocale();
  // 요약은 서버가 저장한 뒤에 생기므로 저장된 신고서에서 가져온다. 못 가져와도 화면은 그대로 보여준다.
  const { data: report } = useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReport(reportId),
  });
  const sourceUrl = draft.sourceUrl.trim();
  const rows: { title: string; body: string }[] = [
    { title: d.overview, body: d.overviewText(draft.damageType.trim()) },
    {
      title: d.incidentDate,
      body: draft.incidentDate ? formatDateLong(draft.incidentDate, locale) : d.empty,
    },
    { title: d.damageType, body: draft.damageType.trim() || d.empty },
    { title: d.route, body: draft.discoveryRoute.trim() || d.empty },
    { title: d.url, body: sourceUrl || d.empty },
    { title: d.description, body: draft.description.trim() || d.empty },
    ...(draft.additionalNotes.trim()
      ? [{ title: d.notes, body: draft.additionalNotes.trim() }]
      : []),
    { title: d.evidence, body: evidence?.name ?? d.noEvidence },
    { title: d.request, body: d.requestText },
  ];

  return (
    <div className="flex w-full flex-col gap-6 md:gap-8">
      <div className="flex w-full flex-col gap-5 rounded-2xl border border-gray-300 p-5 md:gap-6 md:p-8">
        <DraftCardHeader
          title={d.readyTitle}
          description={d.readyDescription}
          status={d.generated}
        />

        <ReportSummary summary={report?.summary} />

        <div className="flex flex-col gap-2">
          <p className="text-body-2 md:text-body-1 px-1 text-black">{d.content}</p>
          <div className="w-full divide-y divide-gray-200 overflow-y-auto rounded-lg border border-gray-300 md:max-h-[427px]">
            {rows.map((row) => (
              <div key={row.title} className="flex flex-col gap-1 p-3 md:gap-1.5 md:p-4">
                <p className="text-body-2 md:text-body-1 font-semibold text-black">{row.title}</p>
                {row.title === d.url && sourceUrl ? (
                  <a
                    href={toHref(sourceUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-body-2 md:text-body-1 text-secondary-600 w-full break-all underline"
                  >
                    {sourceUrl}
                  </a>
                ) : (
                  <p className="text-body-2 md:text-body-1 w-full break-words whitespace-pre-wrap text-black">
                    {row.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepNavigation onBack={onBack}>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <ReportDocumentDownloadButton reportId={reportId} className="w-full md:w-auto" />
          <Link
            href={`/mypage/reports/${reportId}`}
            className={buttonStyle("outline", "w-full md:w-auto")}
          >
            {d.finalizeInMyPage}
          </Link>
          <Button
            type="button"
            variant="primary"
            className="w-full md:w-auto"
            onClick={onFindAgency}
          >
            {d.findAgency}
          </Button>
        </div>
      </StepNavigation>
    </div>
  );
}
