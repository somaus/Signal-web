"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AnalysisGuideCard from "@/shared/ui/AnalysisGuideCard";
import Button from "@/shared/ui/Button";
import PageHeading from "@/shared/ui/PageHeading";
import { pollUntil } from "@/shared/lib/poll";
import { scrollToElement } from "@/shared/lib/scrollToElement";
import Footer from "@/widgets/Footer";
import SiteHeader from "@/widgets/SiteHeader";
import {
  createDeepfakeDetection,
  getDeepfakeDetection,
  isDeepfakeBand,
  type DeepfakeBand,
  type DeepfakeDetectionResponse,
} from "./detectApi";
import DetectResultSection from "./DetectResultSection";
import DetectUploadCard from "./DetectUploadCard";
import { MOCK_RESULT } from "./mockResult";
import type { DetectResult, DetectStatus } from "./types";
import { useT } from "@/shared/i18n/I18nProvider";
import { detectMessages } from "./messages";

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

  return {
    ...MOCK_RESULT,
    deepfakeVerdict: band ? t.band[band] : t.verdict[verdict],
    deepfakeRiskScore: riskScore,
    deepfakeTone: verdict,
    deepfakeBand: band,
    deepfakeCaption: caption,
    overallScore: riskScore,
    overallCaption: caption,
    modelConfidence: confidencePercent,
    modelConfidenceNote: data.fallbackUsed ? t.fallbackNote : t.modelNote,
    fallbackUsed: data.fallbackUsed ?? false,
    modelLabel: data.modelName ? t.modelLabel(data.modelName, data.modelVersion ?? null) : null,
    evidenceHighlights: mapEvidenceHighlights(data, t),
    faceTheftVerdict: t.comingSoon,
    faceTheftScore: 0,
    faceTheftCaption: t.faceTheftCaption,
    webMatchCount: 0,
  };
}

export default function DetectPage() {
  const t = useT(detectMessages);
  const [status, setStatus] = useState<DetectStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detection, setDetection] = useState<DeepfakeDetectionResponse | null>(null);
  const result: DetectResult = detection ? mapDetection(detection, t) : MOCK_RESULT;
  const resultRef = useRef<HTMLDivElement>(null);

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

  function handleReset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setStatus("idle");
  }

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
      setStatus("result");
    },
    onError: (error) => {
      setStatus("selected");
      toast.error(t.failed, {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

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
              <DetectResultSection result={result} previewUrl={previewUrl} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
