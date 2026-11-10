import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Badge from "@/shared/ui/Badge";
import type { RiskLevel } from "@/shared/ui/messages";
import Text from "@/shared/ui/Text";
import { chatMessages } from "./messages";
import type { ChatSummary } from "./useChatSession";

// 서버의 위험 수준 코드를 앱 Badge 등급으로 바꾼다. 모르는 값은 글자 그대로 보여준다.
const riskLevelMap: Record<string, RiskLevel> = {
  LOW: "safe",
  MEDIUM: "caution",
  HIGH: "danger",
};

export function summaryPercent(summary: ChatSummary): number | undefined {
  return summary.progress?.progressPercent ?? summary.progressPercent;
}

export function SummaryProgress({ summary }: { summary: ChatSummary }) {
  const t = useMessages(chatMessages);
  const percent = summaryPercent(summary);
  if (percent === undefined) return null;
  const completed = summary.progress?.completedCount;
  const total = summary.progress?.totalCount;
  const currentStage = summary.progress?.currentStage;
  const stageLabel =
    summary.progress?.stages.find((stage) => stage.stage === currentStage)?.label ?? currentStage;
  const width = Math.min(Math.max(percent, 0), 100);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between gap-3">
        <Text weight="semibold" className="text-small text-gray-700">
          {t.summary.progress}
        </Text>
        <Text weight="semibold" className="shrink text-right text-small">
          {completed !== undefined && total ? t.summary.stepCount(completed, total) : `${percent}%`}
        </Text>
      </View>
      <View className="h-2 w-full rounded-full bg-gray-300">
        <View className="h-2 rounded-full bg-primary-500" style={{ width: `${width}%` }} />
      </View>
      {stageLabel ? <Text className="text-caption text-gray-700">{stageLabel}</Text> : null}
    </View>
  );
}

interface ChatSummaryCardProps {
  summary: ChatSummary;
  /** 최신 요약을 못 받아 이전 내용을 보여주는 중이면 true. */
  stale?: boolean;
}

/** 서버가 보내는 상담 요약(상황, 추천 절차, 위험 수준, 진행도). 있는 항목만 보여준다. */
export default function ChatSummaryCard({ summary, stale = false }: ChatSummaryCardProps) {
  const t = useMessages(chatMessages);
  const risk = summary.riskLevel ? riskLevelMap[summary.riskLevel] : undefined;
  const steps = summary.recommendedSteps ?? [];

  return (
    <View className="gap-4">
      <Text className="text-caption text-gray-650">{t.summary.aiNotice}</Text>
      {stale ? <Text className="text-caption text-red-600">{t.summary.failed}</Text> : null}

      {summary.situation ? (
        <View className="gap-1 border-b border-primary-50 pb-4">
          <Text weight="semibold" className="text-small text-gray-700">
            {t.summary.situation}
          </Text>
          <Text className="text-small">{summary.situation}</Text>
        </View>
      ) : null}

      {steps.length > 0 ? (
        <View className="gap-1 border-b border-primary-50 pb-4">
          <Text weight="semibold" className="text-small text-gray-700">
            {t.summary.steps}
          </Text>
          {steps.map((step, index) => (
            <Text key={index} className="text-small">{`${index + 1}. ${step}`}</Text>
          ))}
        </View>
      ) : null}

      {summary.riskLevel ? (
        <View className="gap-2 border-b border-primary-50 pb-4">
          <View className="flex-row items-center justify-between">
            <Text weight="semibold" className="text-small text-gray-700">
              {t.summary.riskLevel}
            </Text>
            {risk ? (
              <Badge level={risk} />
            ) : (
              <Text className="text-caption text-secondary-900">{summary.riskLevel}</Text>
            )}
          </View>
          {summary.riskDescription ? (
            <Text className="text-small">{summary.riskDescription}</Text>
          ) : null}
        </View>
      ) : null}

      <SummaryProgress summary={summary} />
    </View>
  );
}
