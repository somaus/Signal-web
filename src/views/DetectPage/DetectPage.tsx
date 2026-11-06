"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AnalysisGuideCard from "@/shared/ui/AnalysisGuideCard";
import Button from "@/shared/ui/Button";
import PageHeading from "@/shared/ui/PageHeading";
import { ApiError } from "@/shared/api/axios";
import { isAbortError, pollUntil } from "@/shared/lib/poll";
import { scrollToElement } from "@/shared/lib/scrollToElement";
import Footer from "@/widgets/Footer";
import SiteHeader from "@/widgets/SiteHeader";
import {
  createDeepfakeDetection,
  getDeepfakeDetection,
  isDeepfakeBand,
  startWebSearch,
  type DeepfakeBand,
  type DeepfakeDetectionResponse,
  type DeepfakeVerdict,
  type WebSearchResponse,
} from "./detectApi";
import DetectResultSection from "./DetectResultSection";
import DetectUploadCard from "./DetectUploadCard";
import { MOCK_RESULT } from "./mockResult";
import type { DetectResult, DetectStatus } from "./types";
import { useT } from "@/shared/i18n/I18nProvider";
import { detectMessages } from "./messages";
import { getWebSearchOutcome, raiseBand, type WebSearchOutcome } from "./webSearchOutcome";

const WEB_SEARCH_POLL = { intervalMs: 3000, timeoutMs: 330_000 };

const verdictBand: Record<DeepfakeVerdict, DeepfakeBand> = {
  REAL: "LOW",
  SUSPICIOUS: "UNCERTAIN",
  FAKE: "HIGH",
};

const overallWebNoteKey: Record<WebSearchOutcome, keyof DetectText["overallWebNote"]> = {
  IDLE: "NOT_APPLIED",
  SEARCHING: "NOT_APPLIED",
  UNAVAILABLE: "NOT_APPLIED",
  FAILED: "NOT_APPLIED",
  FOUND: "RAISED",
  SIMILAR_ONLY: "SIMILAR_ONLY",
  NONE: "NONE",
};

function formatEvidenceType(type: string, labels: Record<string, string>): string {
  if (labels[type]) return labels[type];
  return type
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type DetectText = (typeof detectMessages)[keyof typeof detectMessages];

function bandCaption(data: DeepfakeDetectionResponse, band: DeepfakeBand, t: DetectText): string {
  if (band === "UNDETERMINED") {
    const reason = data.undeterminedReason ? t.undeterminedReason[data.undeterminedReason] : null;
    return reason ?? t.bandCaption.UNDETERMINED;
  }
  if (data.assessmentBasis === "PROVENANCE") {
    return t.provenanceCaption[band] ?? t.bandCaption[band];
  }
  return t.bandCaption[band];
}

function mapEvidenceHighlights(data: DeepfakeDetectionResponse, t: DetectText) {
  const provenanceHighlights = (data.provenanceSignals ?? []).map((signal) => {
    const text = t.provenance[signal.code];
    if (text) return text;
    return {
      tab: t.provenanceFallbackTab,
      description: signal.message || t.evidenceNoDescription,
    };
  });
  const modelHighlights = (data.evidences ?? []).map((evidence, index) => ({
    tab: evidence.type
      ? formatEvidenceType(evidence.type, t.evidenceType)
      : t.evidenceFallbackTab(index + 1),
    description: evidence.description || t.evidenceNoDescription,
  }));
  const highlights = [...provenanceHighlights, ...modelHighlights];
  return highlights.length > 0
    ? highlights
    : [{ tab: t.noEvidenceTab, description: t.noEvidenceDescription }];
}

function mapDetection(data: DeepfakeDetectionResponse, t: DetectText): DetectResult {
  const knownBand = isDeepfakeBand(data.band) ? data.band : null;
  const hasLegacyResult = data.verdict != null || data.riskScore != null;
  const band: DeepfakeBand | null = knownBand ?? (hasLegacyResult ? null : "UNDETERMINED");
  const verdict = data.verdict ?? "SUSPICIOUS";
  const confidencePercent = Math.round((data.confidence ?? 0) * 100);
  const riskScore = data.riskScore ?? null;
  const caption = band ? bandCaption(data, band, t) : t.verdictCaption[verdict];
  const webOutcome = getWebSearchOutcome(data.webSearch);
  const overallBand = webOutcome === "FOUND" ? raiseBand(band ?? verdictBand[verdict]) : band;

  return {
    ...MOCK_RESULT,
    deepfakeVerdict: band ? t.band[band] : t.verdict[verdict],
    deepfakeRiskScore: riskScore,
    deepfakeTone: verdict,
    deepfakeBand: band,
    deepfakeCaption: caption,
    overallScore: riskScore,
    overallCaption: caption,
    overallBand,
    overallWebNote: t.overallWebNote[overallWebNoteKey[webOutcome]],
    modelConfidence: confidencePercent,
    modelConfidenceNote: data.fallbackUsed ? t.fallbackNote : t.modelNote,
    fallbackUsed: data.fallbackUsed ?? false,
    modelLabel: data.modelName ? t.modelLabel(data.modelName, data.modelVersion ?? null) : null,
    evidenceHighlights: mapEvidenceHighlights(data, t),
  };
}

export default function DetectPage() {
  const t = useT(detectMessages);
  const [status, setStatus] = useState<DetectStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detection, setDetection] = useState<DeepfakeDetectionResponse | null>(null);
  const [webSearchOff, setWebSearchOff] = useState(false);
  const result: DetectResult = detection ? mapDetection(detection, t) : MOCK_RESULT;
  const resultRef = useRef<HTMLDivElement>(null);
  const webSearchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => webSearchAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (status !== "result" || !resultRef.current) return;
    return scrollToElement(resultRef.current);
  }, [status]);

  function handleFileSelect(file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
    setStatus("selected");
  }

  function cancelWebSearch() {
    webSearchAbortRef.current?.abort();
    webSearchAbortRef.current = null;
    webSearchMutation.reset();
  }

  function handleReset() {
    cancelWebSearch();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setStatus("idle");
  }

  const webSearchMutation = useMutation({
    mutationFn: async (detectionId: number): Promise<WebSearchResponse> => {
      webSearchAbortRef.current?.abort();
      const controller = new AbortController();
      webSearchAbortRef.current = controller;
      const started = await startWebSearch(detectionId);
      if (started.status !== "PROCESSING") return started;
      const latest = await pollUntil(
        () => getDeepfakeDetection(detectionId),
        (polled) => polled.webSearch?.status !== "PROCESSING",
        { ...WEB_SEARCH_POLL, signal: controller.signal },
      );
      return latest.webSearch ?? started;
    },
    onSuccess: (webSearch, detectionId) => {
      setDetection((prev) =>
        prev && prev.detectionId === detectionId ? { ...prev, webSearch } : prev,
      );
    },
    onError: (error) => {
      if (isAbortError(error)) return;
      if (error instanceof ApiError && error.code === "WEB_SEARCH_DISABLED") {
        setWebSearchOff(true);
        return;
      }
      toast.error(t.webSearch.failed, {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  const detectMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error(t.selectFile);
      const created = await createDeepfakeDetection(selectedFile);
      return pollUntil(
        () => getDeepfakeDetection(created.detectionId),
        (detection) => detection.status !== "PROCESSING",
      );
    },
    onSuccess: (data) => {
      if (data.status === "FAILED") {
        setStatus("selected");
        const failure = data.failureReason ? t.failure[data.failureReason] : undefined;
        toast.error(failure?.title ?? t.failed, {
          description: failure?.description ?? t.retry,
        });
        return;
      }
      setDetection(data);
      setWebSearchOff(false);
      cancelWebSearch();
      setStatus("result");
    },
    onError: (error) => {
      setStatus("selected");
      toast.error(t.failed, {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  function handleWebSearch() {
    if (!detection || webSearchMutation.isPending) return;
    webSearchMutation.mutate(detection.detectionId);
  }

  function handleDetect() {
    setStatus("analyzing");
    detectMutation.mutate();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-col items-center bg-white px-5 py-6 pb-[120px] md:py-10">
        <div className="flex w-full max-w-[1280px] animate-[fade-in-up_0.5s_ease-out] flex-col items-end gap-6">
          <div className="flex w-full flex-col items-start gap-6 md:gap-12">
            <PageHeading
              title={t.title}
              description={t.description}
              breadcrumbs={[{ label: t.title }]}
            />

            <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row lg:gap-10">
              <DetectUploadCard
                status={status}
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
                onReset={handleReset}
              />
              <AnalysisGuideCard />
            </div>
          </div>

          {status !== "result" && (
            <Button
              type="button"
              variant="primary"
              className="w-full md:w-[253px]"
              disabled={status !== "selected"}
              onClick={handleDetect}
            >
              {t.start}
            </Button>
          )}

          {status === "result" && (
            <div ref={resultRef} className="w-full">
              <DetectResultSection
                result={result}
                previewUrl={previewUrl}
                webSearch={detection?.webSearch ?? null}
                webSearchOff={webSearchOff || detection?.webSearchAvailable === false}
                webSearchPending={webSearchMutation.isPending}
                onWebSearch={handleWebSearch}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
