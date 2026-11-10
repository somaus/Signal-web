import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ApiError } from "@/shared/api/axios";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import type { ButtonVariant } from "@/shared/ui/Button";
import { CannotOpenDocumentError, downloadAndOpenReportDocument } from "./downloadReportDocument";
import { reportDocumentMessages } from "./messages";

interface ReportDocumentButtonProps {
  reportId: number;
  variant?: ButtonVariant;
  disabled?: boolean;
}

/** 신고 문서(PDF)를 받아 공유 시트로 연다. 실패하면 이유를 알려준다. */
export default function ReportDocumentButton({
  reportId,
  variant = "outline",
  disabled = false,
}: ReportDocumentButtonProps) {
  const t = useMessages(reportDocumentMessages);

  const download = useMutation({
    mutationFn: () => downloadAndOpenReportDocument(reportId, t.shareTitle),
    onError: (error) => {
      if (error instanceof CannotOpenDocumentError) {
        Alert.alert(t.cannotOpen);
        return;
      }
      // 서버가 알려준 이유(로그인 만료 등)가 있으면 같이 보여준다. 파일 시스템 오류 문구는 보여주지 않는다.
      Alert.alert(t.downloadFailed, error instanceof ApiError ? error.message : undefined);
    },
  });

  return (
    <Button
      title={download.isPending ? t.downloading : t.download}
      variant={variant}
      loading={download.isPending}
      disabled={disabled}
      onPress={() => download.mutate()}
    />
  );
}
