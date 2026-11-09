"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { downloadReportDocument } from "@/entities/report/api";
import { useT } from "@/shared/i18n/I18nProvider";
import Button, { type ButtonVariant } from "@/shared/ui/Button";
import { reportDocumentMessages } from "./reportDocumentMessages";

interface ReportDocumentDownloadButtonProps {
  reportId: number;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

/** 신고 문서(PDF)는 로그인이 필요한 API라 링크가 아니라 blob으로 받아 저장한다. */
export default function ReportDocumentDownloadButton({
  reportId,
  variant = "outline",
  className = "",
  disabled = false,
}: ReportDocumentDownloadButtonProps) {
  const t = useT(reportDocumentMessages);

  const downloadMutation = useMutation({
    mutationFn: () => downloadReportDocument(reportId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `signal-report-${reportId}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    onError: () => {
      toast.error(t.downloadFailed);
    },
  });

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={disabled || downloadMutation.isPending}
      onClick={() => downloadMutation.mutate()}
    >
      {downloadMutation.isPending ? t.downloading : t.download}
    </Button>
  );
}
