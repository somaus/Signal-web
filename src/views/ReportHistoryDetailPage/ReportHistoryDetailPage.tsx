"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteReport,
  finalizeReport,
  getReport,
  updateReport,
  type ReportResponse,
  type UpdateReportRequest,
} from "@/entities/report/api";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import NoticeBanner from "@/shared/ui/NoticeBanner";
import PageHeading from "@/shared/ui/PageHeading";
import ReportDocumentDownloadButton from "@/views/ReportPage/ReportDocumentDownloadButton";
import ReportSummary from "@/views/ReportPage/ReportSummary";
import Footer from "@/widgets/Footer";
import SiteHeader from "@/widgets/SiteHeader";
import { useLocale, useT } from "@/shared/i18n/I18nProvider";
import { formatDateLong } from "@/shared/i18n/format";
import { mypageMessages } from "@/views/mypageMessages";

interface ReportHistoryDetailPageProps {
  id: string;
}

interface EditableFields {
  incidentDate: string;
  damageType: string;
  discoveryRoute: string;
  sourceUrl: string;
  description: string;
  additionalNotes: string;
}

function ReportContentView({ report }: { report: ReportResponse }) {
  const { reports: t } = useT(mypageMessages);
  const { locale } = useLocale();
  const sourceUrl = report.sourceUrls?.[0];
  return (
    <div className="text-small md:text-body-1 text-gray-650 flex flex-col gap-4 break-words md:gap-6">
      <p>
        {t.overview}
        <br />
        {t.overviewText(report.damageType ?? t.itemFallback)}
      </p>
      <p>
        {t.incidentDate}
        <br />
        {report.incidentDate ? formatDateLong(report.incidentDate, locale) : t.empty2}
      </p>
      <p>
        {t.damageType}
        <br />
        {report.damageType || t.empty2}
      </p>
      <p>
        {t.route}
        <br />
        {report.discoveryRoute || t.empty2}
      </p>
      <p>
        {t.url}
        <br />
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-secondary-600 break-all underline"
          >
            {sourceUrl}
          </a>
        ) : (
          t.empty2
        )}
      </p>
      <p className="whitespace-pre-wrap">
        {t.details}
        <br />
        {report.description || t.empty2}
      </p>
      {report.additionalNotes && (
        <p className="whitespace-pre-wrap">
          {t.notes}
          <br />
          {report.additionalNotes}
        </p>
      )}
      <p>
        {t.evidence}
        <br />
        {report.evidenceIds && report.evidenceIds.length > 0
          ? t.evidenceCount(report.evidenceIds.length)
          : t.noEvidence}
      </p>
      <p>
        {t.request}
        <br />
        {t.requestText}
      </p>
    </div>
  );
}

export default function ReportHistoryDetailPage({ id }: ReportHistoryDetailPageProps) {
  const reportId = Number(id);
  const { reports: t, loading, cancel } = useT(mypageMessages);
  const { locale } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditableFields | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);

  const {
    data: report,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReport(reportId),
    enabled: Number.isFinite(reportId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateReportRequest) => updateReport(reportId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["reports", reportId], updated);
      setIsEditing(false);
      toast.success(t.saved);
    },
    onError: (mutationError) => {
      toast.error(t.saveFailed, {
        description: mutationError instanceof Error ? mutationError.message : undefined,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteReport(reportId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["reports", reportId] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setDeleteModalOpen(false);
      toast.success(t.deleted);
      router.push("/mypage/reports");
    },
    onError: (mutationError) => {
      setDeleteModalOpen(false);
      toast.error(t.deleteFailed, {
        description: mutationError instanceof Error ? mutationError.message : undefined,
      });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: () => finalizeReport(reportId),
    onSuccess: (result) => {
      queryClient.setQueryData(
        ["reports", reportId],
        report ? { ...report, status: result.status } : report,
      );
      queryClient.invalidateQueries({ queryKey: ["reports", reportId] });
      setFinalizeModalOpen(false);
      toast.success(t.finalizedToast);
    },
    onError: (mutationError) => {
      setFinalizeModalOpen(false);
      toast.error(t.finalizeFailed, {
        description: mutationError instanceof Error ? mutationError.message : undefined,
      });
    },
  });

  if (!Number.isFinite(reportId)) {
    return (
      <>
        <SiteHeader />
        <main className="flex w-full flex-col items-center bg-white px-5 py-20">
          <p className="text-body-1 text-gray-700">{t.invalidId}</p>
        </main>
        <Footer />
      </>
    );
  }

  function startEditing() {
    if (!report) return;
    setDraft({
      incidentDate: report.incidentDate ?? "",
      damageType: report.damageType ?? "",
      discoveryRoute: report.discoveryRoute ?? "",
      sourceUrl: report.sourceUrls?.[0] ?? "",
      description: report.description ?? "",
      additionalNotes: report.additionalNotes ?? "",
    });
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEditing() {
    if (!draft) return;
    const valueOrNull = (value: string) => value.trim() || null;
    updateMutation.mutate({
      incidentDate: valueOrNull(draft.incidentDate),
      damageType: valueOrNull(draft.damageType),
      discoveryRoute: valueOrNull(draft.discoveryRoute),
      sourceUrls: draft.sourceUrl.trim() ? [draft.sourceUrl.trim()] : [],
      description: valueOrNull(draft.description),
      additionalNotes: valueOrNull(draft.additionalNotes),
    });
  }

  function handleDelete() {
    setDeleteModalOpen(true);
  }

  function handleFindAgency() {
    router.push("/support-referral");
  }

  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-col items-center bg-white px-5 py-6 pb-[120px] md:py-10">
        <div className="flex w-full max-w-[1280px] animate-[fade-in-up_0.5s_ease-out] flex-col gap-6 md:gap-8">
          <PageHeading
            title={t.detailTitle}
            description={
              report
                ? `${t.created(formatDateLong(report.createdAt, locale))} · ${
                    report.status === "FINALIZED" ? t.finalized : t.draftStatus
                  }`
                : undefined
            }
            breadcrumbs={[{ label: t.title, href: "/mypage/reports" }, { label: t.detailCrumb }]}
            backHref="/mypage/reports"
          />

          {isPending && <p className="text-body-1 text-gray-700">{loading}</p>}

          {isError && (
            <p className="text-body-1 text-red-500">
              {t.detailLoadFailed}
              {error instanceof Error ? ` (${error.message})` : ""}
            </p>
          )}

          {report && (
            <>
              <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-gray-300 p-5 sm:p-8">
                <div className="flex w-full max-w-[960px] flex-col gap-1">
                  <p className="text-h3 font-semibold text-black">{t.reviewTitle}</p>
                  {isEditing && <p className="text-body-2 text-gray-700">{t.reviewDescription}</p>}
                </div>

                <NoticeBanner className="w-full max-w-[960px]">{t.aiNotice}</NoticeBanner>

                <div className="flex w-full max-w-[960px] flex-col gap-3">
                  <ReportDocumentDownloadButton reportId={reportId} className="w-full md:w-fit" />
                  {!isEditing && <ReportSummary summary={report.summary} />}
                </div>

                <div className="flex w-full max-w-[960px] flex-col gap-2">
                  <p className="text-body-2 md:text-body-1 text-black">{t.content}</p>
                  {isEditing && draft ? (
                    <div className="flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-300">
                      <div className="flex flex-col gap-1.5 p-3 md:p-4">
                        <label className="text-body-2 md:text-body-1 font-semibold text-black">
                          {t.incidentDate}
                        </label>
                        <input
                          type="date"
                          value={draft.incidentDate}
                          onChange={(event) =>
                            setDraft({ ...draft, incidentDate: event.target.value })
                          }
                          className="text-body-2 md:text-body-1 focus:border-secondary-500 w-full rounded border border-gray-300 px-3 py-2 text-black outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 p-3 md:p-4">
                        <label className="text-body-2 md:text-body-1 font-semibold text-black">
                          {t.damageType}
                        </label>
                        <input
                          type="text"
                          value={draft.damageType}
                          onChange={(event) =>
                            setDraft({ ...draft, damageType: event.target.value })
                          }
                          className="text-body-2 md:text-body-1 focus:border-secondary-500 w-full rounded border border-gray-300 px-3 py-2 text-black outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 p-3 md:p-4">
                        <label className="text-body-2 md:text-body-1 font-semibold text-black">
                          {t.route}
                        </label>
                        <input
                          type="text"
                          value={draft.discoveryRoute}
                          onChange={(event) =>
                            setDraft({ ...draft, discoveryRoute: event.target.value })
                          }
                          className="text-body-2 md:text-body-1 focus:border-secondary-500 w-full rounded border border-gray-300 px-3 py-2 text-black outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 p-3 md:p-4">
                        <label className="text-body-2 md:text-body-1 font-semibold text-black">
                          {t.url}
                        </label>
                        <input
                          type="url"
                          value={draft.sourceUrl}
                          onChange={(event) =>
                            setDraft({ ...draft, sourceUrl: event.target.value })
                          }
                          className="text-body-2 md:text-body-1 focus:border-secondary-500 w-full rounded border border-gray-300 px-3 py-2 text-black outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 p-3 md:p-4">
                        <label className="text-body-2 md:text-body-1 font-semibold text-black">
                          {t.details}
                        </label>
                        <textarea
                          value={draft.description}
                          onChange={(event) =>
                            setDraft({ ...draft, description: event.target.value })
                          }
                          rows={6}
                          className="text-body-2 md:text-body-1 focus:border-secondary-500 w-full resize-none rounded border border-gray-300 p-3 whitespace-pre-wrap text-black outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 p-3 md:p-4">
                        <label className="text-body-2 md:text-body-1 font-semibold text-black">
                          {t.notes}
                        </label>
                        <textarea
                          value={draft.additionalNotes}
                          onChange={(event) =>
                            setDraft({ ...draft, additionalNotes: event.target.value })
                          }
                          rows={3}
                          className="text-body-2 md:text-body-1 focus:border-secondary-500 w-full resize-none rounded border border-gray-300 p-3 whitespace-pre-wrap text-black outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-gray-100 p-4 md:h-[427px] md:p-[17px]">
                      <ReportContentView report={report} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer self-start text-[15px] leading-6 text-red-500 underline disabled:opacity-50"
                >
                  {t.delete}
                </button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="border-primary-500 text-primary-500 text-body-2 active:bg-primary-50 flex h-12 items-center justify-center rounded border px-6 transition-colors"
                      >
                        {cancel}
                      </button>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={updateMutation.isPending}
                        onClick={saveEditing}
                      >
                        {updateMutation.isPending ? t.saving : t.save}
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={startEditing}
                        className="border-primary-500 text-primary-500 text-body-2 active:bg-primary-50 flex h-12 items-center justify-center rounded border px-6 transition-colors"
                      >
                        {t.edit}
                      </button>
                      {report.status === "DRAFT" && (
                        <button
                          type="button"
                          onClick={() => setFinalizeModalOpen(true)}
                          disabled={finalizeMutation.isPending}
                          className="border-primary-500 text-primary-500 text-body-2 active:bg-primary-50 flex h-12 items-center justify-center rounded border px-6 transition-colors disabled:opacity-50"
                        >
                          {finalizeMutation.isPending ? t.finalizing : t.finalize}
                        </button>
                      )}
                      <Button type="button" variant="primary" onClick={handleFindAgency}>
                        {t.findAgency}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <ConfirmModal
        open={deleteModalOpen}
        title={t.deleteTitle}
        description={t.deleteDescription}
        confirmLabel={t.deleteConfirm}
        cancelLabel={cancel}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteModalOpen(false)}
      />
      <ConfirmModal
        open={finalizeModalOpen}
        title={t.finalizeTitle}
        description={t.finalizeDescription}
        confirmLabel={t.finalizeConfirm}
        cancelLabel={cancel}
        onConfirm={() => finalizeMutation.mutate()}
        onCancel={() => setFinalizeModalOpen(false)}
      />
    </>
  );
}
