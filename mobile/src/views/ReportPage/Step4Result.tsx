import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { getReport } from "@/entities/report/api";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Text from "@/shared/ui/Text";
import ReportDocumentButton from "@/widgets/report/ReportDocumentButton";
import ReportSummary from "@/widgets/report/ReportSummary";
import { reportMessages } from "./messages";

interface Step4ResultProps {
  reportId: number;
  onEdit: () => void;
  onNewReport: () => void;
}

/** 저장된 신고서의 AI 요약과 PDF 내려받기. 요약을 못 불러와도 나머지는 그대로 쓸 수 있다. */
export default function Step4Result({ reportId, onEdit, onNewReport }: Step4ResultProps) {
  const t = useMessages(reportMessages);
  const router = useRouter();
  const report = useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReport(reportId),
  });

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text weight="bold" className="text-body-1">
          {t.result.title}
        </Text>
        <Text className="text-small text-gray-650">{t.result.description}</Text>
      </View>

      {report.isPending ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color={colors.gray600} />
          <Text className="text-small text-gray-650">{t.result.loadingSummary}</Text>
        </View>
      ) : (
        <ReportSummary summary={report.data?.summary} />
      )}

      <ReportDocumentButton reportId={reportId} variant="primary" />
      <Button
        title={t.result.openDetail}
        variant="outline"
        onPress={() => router.push(`/reports/${reportId}`)}
      />
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title={t.result.edit} variant="outline" onPress={onEdit} />
        </View>
        <View className="flex-1">
          <Button title={t.result.newReport} variant="outline" onPress={onNewReport} />
        </View>
      </View>
    </View>
  );
}
