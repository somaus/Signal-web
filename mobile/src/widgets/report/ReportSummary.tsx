import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Text from "@/shared/ui/Text";
import { reportDocumentMessages } from "./messages";

/** 서버가 만든 AI 사건 개요. 요약이 없으면 항목 자체를 숨긴다. */
export default function ReportSummary({ summary }: { summary?: string | null }) {
  const t = useMessages(reportDocumentMessages);
  if (!summary?.trim()) return null;
  return (
    <View className="gap-2 rounded-xl border border-primary-100 bg-primary-50 p-4">
      <Text weight="semibold">{t.summaryTitle}</Text>
      <Text className="text-small">{summary.trim()}</Text>
      <Text className="text-caption text-gray-650">{t.summaryNotice}</Text>
    </View>
  );
}
