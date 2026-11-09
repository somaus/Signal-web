"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createRiskAssessment,
  getAssessment,
  isCompletedAssessment,
  type RiskAssessmentResponse,
} from "@/entities/analysis/api";
import { mapAssessment, type AnalysisResult } from "@/entities/analysis/model";
import { shareAnalysisResult } from "@/features/analysis-share/shareAnalysisResult";
import { ApiError } from "@/shared/api/axios";
import { getAccessToken } from "@/shared/lib/authToken";
import { isAbortError, pollUntil } from "@/shared/lib/poll";
import { createProtection, downloadProtection, getProtection } from "./analyzeApi";
import { useLocale, useT } from "@/shared/i18n/I18nProvider";
import { analyzeMessages } from "./messages";
import { loadAnalyzeSession, saveAnalyzeSession, type Status } from "./analyzeSession";

export type { Status };

function needsLogin(error: unknown) {
  if (!(error instanceof Error) || !error.message) return true;
  return (
    error instanceof ApiError &&
    (error.code === "UNAUTHORIZED" || error.code === "ANONYMOUS_ID_REQUIRED")
  );
}

const ASSESSMENT_POLL = { intervalMs: 2000, timeoutMs: 330_000 };

export function useAnalyzeFlow() {
  const t = useT(analyzeMessages);
  const { locale } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [initial] = useState(loadAnalyzeSession);
  const [status, setStatus] = useState<Status>(initial.status);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial.previewUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(initial.selectedFile);
  const [showDetails, setShowDetails] = useState(initial.showDetails);
  const [isProtected, setIsProtected] = useState(initial.isProtected);
  const [isSimulatedProtection, setIsSimulatedProtection] = useState(initial.isSimulatedProtection);
  const [assessment, setAssessment] = useState<RiskAssessmentResponse | null>(initial.assessment);
  const result: AnalysisResult | null =
    assessment && isCompletedAssessment(assessment) ? mapAssessment(assessment, locale) : null;
  const [assessmentId, setAssessmentId] = useState<number | null>(initial.assessmentId);
  const [protectionId, setProtectionId] = useState<number | null>(initial.protectionId);
  const analyzeAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => analyzeAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    saveAnalyzeSession({
      status,
      previewUrl,
      selectedFile,
      showDetails,
      isProtected,
      isSimulatedProtection,
      assessment,
      assessmentId,
      protectionId,
    });
  }, [
    status,
    previewUrl,
    selectedFile,
    showDetails,
    isProtected,
    isSimulatedProtection,
    assessment,
    assessmentId,
    protectionId,
  ]);

  function showError(title: string, error: unknown, guestFallback: string) {
    const message = error instanceof Error ? error.message : undefined;
    if (getAccessToken() || !needsLogin(error)) {
      toast.error(title, { description: message });
      return;
    }
    toast.error(title, {
      description: guestFallback,
      action: { label: t.flow.login, onClick: () => router.push("/login") },
    });
  }

  function cancelAnalysis() {
    analyzeAbortRef.current?.abort();
    analyzeAbortRef.current = null;
  }

  function handleFileSelect(file: File) {
    cancelAnalysis();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
    setShowDetails(false);
    setIsProtected(false);
    setIsSimulatedProtection(false);
    setAssessment(null);
    setAssessmentId(null);
    setProtectionId(null);
    setStatus("selected");
  }

  function handleReset() {
    cancelAnalysis();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setShowDetails(false);
    setIsProtected(false);
    setIsSimulatedProtection(false);
    setAssessment(null);
    setAssessmentId(null);
    setProtectionId(null);
    setStatus("idle");
  }

  const analyzeMutation = useMutation({
    mutationFn: async (resumeId: number | null) => {
      cancelAnalysis();
      const controller = new AbortController();
      analyzeAbortRef.current = controller;
      let pendingId = resumeId;
      if (pendingId === null) {
        if (!selectedFile) throw new Error(t.flow.selectImage);
        const created = await createRiskAssessment(selectedFile);
        if (controller.signal.aborted) throw new DOMException("Analysis aborted", "AbortError");
        if (created.status !== "PROCESSING") return created;
        pendingId = created.assessmentId;
        setAssessmentId(pendingId);
      }
      const assessmentToPoll = pendingId;
      return pollUntil(
        () => getAssessment(assessmentToPoll),
        (polled) => polled.status !== "PROCESSING",
        { ...ASSESSMENT_POLL, signal: controller.signal },
      );
    },
    onSuccess: (data) => {
      if (data.status === "FAILED" && data.failureReason !== "NO_FACE_DETECTED") {
        setAssessmentId(null);
        setStatus("selected");
        const reason = data.failureReason ? t.flow.failure[data.failureReason] : undefined;
        toast.error(t.flow.analyzeFailed, { description: reason ?? t.flow.retry });
        return;
      }
      if (data.status === "FAILED" || !data.faceDetected) {
        setAssessmentId(null);
        setStatus("error");
        return;
      }
      queryClient.setQueryData(["riskAssessments", data.assessmentId], data);
      queryClient.invalidateQueries({ queryKey: ["riskAssessments"], exact: true });
      setAssessmentId(data.assessmentId);
      setAssessment(data);
      setStatus("result");
    },
    onError: (error) => {
      if (isAbortError(error)) return;
      setAssessmentId(null);
      setStatus("selected");
      showError(t.flow.analyzeFailed, error, t.flow.loginAndRetry);
    },
  });

  const { mutate: analyze } = analyzeMutation;

  useEffect(() => {
    if (initial.status === "analyzing" && initial.assessmentId !== null) {
      analyze(initial.assessmentId);
    }
  }, [analyze, initial.status, initial.assessmentId]);

  const protectMutation = useMutation({
    mutationFn: async () => {
      if (!assessmentId) throw new Error(t.flow.analyzeFirst);
      const created = await createProtection(assessmentId);
      return pollUntil(
        () => getProtection(created.protectionId),
        (protection) => protection.status !== "PROCESSING",
      );
    },
    onSuccess: (protection) => {
      if (protection.status === "FAILED") {
        toast.error(t.flow.protectFailed);
        return;
      }
      setProtectionId(protection.protectionId);
      const simulated = protection.simulated === true;
      setIsProtected(true);
      setIsSimulatedProtection(simulated);
      setShowDetails(true);
      toast.success(t.flow.protectReady, {
        description: simulated ? t.flow.protectSimulated : t.flow.protectApplied,
      });
    },
    onError: (error) => {
      showError(t.flow.protectFailed, error, t.flow.protectLoginOnly);
    },
  });

  const saveProtectedMutation = useMutation({
    mutationFn: async () => {
      if (!protectionId) throw new Error(t.flow.noProtected);
      return downloadProtection(protectionId);
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "protected-image";
      link.click();
      URL.revokeObjectURL(url);
      toast.success(t.flow.saved);
    },
    onError: (error) => {
      showError(t.flow.saveFailed, error, t.flow.saveLoginOnly);
    },
  });

  function handleAnalyze() {
    setAssessmentId(null);
    setStatus("analyzing");
    analyzeMutation.mutate(null);
  }

  function handleProtect() {
    if (protectMutation.isPending) return;
    protectMutation.mutate();
  }

  function handleShare() {
    if (result) void shareAnalysisResult(result);
  }

  function handleSaveProtected() {
    if (saveProtectedMutation.isPending) return;
    saveProtectedMutation.mutate();
  }

  return {
    status,
    previewUrl,
    showDetails,
    isProtected,
    isSimulatedProtection,
    result,
    assessmentId,
    toggleDetails: () => setShowDetails((prev) => !prev),
    handleFileSelect,
    handleReset,
    handleAnalyze,
    handleProtect,
    handleShare,
    handleSaveProtected,
  };
}
