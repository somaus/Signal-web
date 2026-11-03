"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { toast } from "sonner";
import {
  createMonitoring,
  deleteMonitoring,
  getMonitoring,
  getMonitoringDetections,
} from "@/entities/monitoring/api";
import ImageArrowUp from "@/shared/asset/svg/ImageArrowUp";
import ImageIcon from "@/shared/asset/svg/Image";
import PageHeading from "@/shared/ui/PageHeading";
import {
  clearStoredMonitoringId,
  getStoredMonitoringId,
  setStoredMonitoringId,
} from "@/shared/lib/monitoringId";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import Footer from "@/widgets/Footer";
import SiteHeader from "@/widgets/SiteHeader";
import { useLocale, useT } from "@/shared/i18n/I18nProvider";
import { formatDateLong, formatDateTime } from "@/shared/i18n/format";
import { monitoringMessages } from "./messages";

const PAGE_SIZE = 9;

function isWebUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

export default function MonitoringPage() {
  const t = useT(monitoringMessages);
  const { locale } = useLocale();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [monitoringId, setMonitoringId] = useState<number | null>(() => getStoredMonitoringId());
  const [page, setPage] = useState(0);
  const [stopModalOpen, setStopModalOpen] = useState(false);

  const {
    data: detectionPage,
    isPending: isDetectionsPending,
    isError: isDetectionsError,
  } = useQuery({
    queryKey: ["monitoringDetections", monitoringId, page],
    queryFn: () => getMonitoringDetections(monitoringId as number, page, PAGE_SIZE),
    enabled: monitoringId !== null,
  });

  const { data: monitoring } = useQuery({
    queryKey: ["monitoring", monitoringId],
    queryFn: () => getMonitoring(monitoringId as number),
    enabled: monitoringId !== null,
  });

  const createMutation = useMutation({
    mutationFn: (file: File) => createMonitoring(file),
    onSuccess: (data) => {
      setStoredMonitoringId(data.monitoringId);
      setMonitoringId(data.monitoringId);
      setPage(0);
      toast.success(t.started);
    },
    onError: (error) => {
      toast.error(t.startFailed, {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMonitoring(monitoringId as number),
    onSuccess: () => {
      clearStoredMonitoringId();
      setMonitoringId(null);
      setPage(0);
      setStopModalOpen(false);
      queryClient.removeQueries({ queryKey: ["monitoring"] });
      queryClient.removeQueries({ queryKey: ["monitoringDetections"] });
      toast.success(t.stopped);
    },
    onError: (error) => {
      setStopModalOpen(false);
      toast.error(t.stopFailed, {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  function handleFile(file: File) {
    if (createMutation.isPending) return;
    createMutation.mutate(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const detections = detectionPage?.content ?? [];
  const totalPages = detectionPage?.totalPages ?? 0;
  const hasSimulated = detections.some((detection) => detection.simulated);
  const hasRealResults = detections.some((detection) => !detection.simulated);
  const isPaused = monitoring?.status === "PAUSED";

  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-col items-center bg-white px-5 py-6 pb-[120px] md:py-10">
        <div className="flex w-full max-w-[1280px] animate-[fade-in-up_0.5s_ease-out] flex-col gap-6 md:gap-8">
          <PageHeading
            title={t.title}
            description={t.description}
            breadcrumbs={[{ label: t.title }]}
          />

          {monitoringId === null ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex w-full flex-col items-center gap-6 rounded-2xl border-2 border-dashed px-3 py-10 transition-colors md:py-16 ${
                isDragging ? "border-primary-500 bg-primary-50" : "border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-black [&>svg]:h-10 [&>svg]:w-10 md:[&>svg]:h-12 md:[&>svg]:w-12">
                  <ImageArrowUp />
                </span>
                <p className="text-body-2 md:text-body-1 font-semibold text-black">
                  {t.uploadTitle}
                </p>
                <p className="text-small md:text-body-2 text-gray-650">{t.fileTypes}</p>
              </div>
              <p className="text-small max-w-[560px] text-center break-keep text-gray-700">
                {t.externalNotice}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="primary"
                className="w-[171px]"
                disabled={createMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {createMutation.isPending ? t.starting : t.start}
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`flex items-center justify-between gap-4 rounded-2xl p-5 md:p-6 ${
                  isPaused ? "bg-yellow-50" : "bg-primary-50"
                }`}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-small text-gray-700">{t.status}</p>
                  <p
                    className={`text-large md:text-h3 font-semibold ${
                      isPaused ? "text-yellow-500" : "text-black"
                    }`}
                  >
                    {isPaused ? t.paused : t.monitoring}
                  </p>
                  {isPaused && (
                    <p className="text-small break-keep text-gray-700">{t.pausedDescription}</p>
                  )}
                  {monitoring?.lastSearchedAt && (
                    <p className="text-caption text-gray-650">
                      {t.lastSearched(formatDateTime(monitoring.lastSearchedAt, locale))}
                    </p>
                  )}
                  {!isPaused && monitoring?.nextSearchAt && (
                    <p className="text-caption text-gray-650">
                      {t.nextSearch(formatDateTime(monitoring.nextSearchAt, locale))}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStopModalOpen(true)}
                  disabled={deleteMutation.isPending}
                  className="border-primary-500 text-primary-500 text-body-2 active:bg-primary-50 flex h-11 shrink-0 cursor-pointer items-center justify-center rounded border px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:px-6"
                >
                  {deleteMutation.isPending ? t.stopping : t.stop}
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 px-1">
                  <p className="text-large md:text-h3 font-semibold text-black">{t.resultsTitle}</p>
                  {hasSimulated && (
                    <p className="text-small break-keep text-gray-700">{t.resultsDemo}</p>
                  )}
                  {hasRealResults && (
                    <p className="text-small break-keep text-gray-700">{t.resultsNote}</p>
                  )}
                </div>

                {isDetectionsPending && (
                  <p className="text-body-1 px-1 text-gray-700">{t.loading}</p>
                )}

                {isDetectionsError && (
                  <p className="text-body-1 px-1 text-red-500">{t.loadFailed}</p>
                )}

                {detectionPage && detections.length === 0 && (
                  <p className="text-body-1 px-1 text-gray-700">{t.empty}</p>
                )}

                {detections.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
                    {detections.map((detection) => (
                      <div
                        key={detection.detectionId}
                        className="flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-300 p-3 md:p-4"
                      >
                        <div className="flex aspect-square size-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {detection.simulated && detection.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={detection.thumbnailUrl}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 [&>svg]:h-8 [&>svg]:w-8">
                              <ImageIcon />
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          {(detection.matchType || detection.simulated) && (
                            <p className="text-body-2 md:text-body-1 font-semibold text-black">
                              {detection.matchType
                                ? t.matchType[detection.matchType]
                                : t.simulatedBadge}
                            </p>
                          )}
                          {detection.title && (
                            <p className="text-small line-clamp-2 break-all text-gray-800">
                              {detection.title}
                            </p>
                          )}
                          {detection.sourceDomain && (
                            <p className="text-caption text-gray-650 truncate">
                              {detection.sourceDomain}
                            </p>
                          )}
                          <p className="text-small text-gray-700">
                            {formatDateLong(detection.detectedAt, locale)}
                          </p>
                          {isWebUrl(detection.sourceUrl) && (
                            <a
                              href={detection.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-secondary-600 text-small break-all underline"
                            >
                              {t.viewSource}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                      disabled={page === 0}
                      className="text-body-2 text-primary-500 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {t.prev}
                    </button>
                    <span className="text-body-2 text-gray-700">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                      disabled={page >= totalPages - 1}
                      className="text-body-2 text-primary-500 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {t.next}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <ConfirmModal
        open={stopModalOpen}
        title={t.stopTitle}
        description={t.stopDescription}
        confirmLabel={t.stopConfirm}
        cancelLabel={t.cancel}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setStopModalOpen(false)}
      />
    </>
  );
}
