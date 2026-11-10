import { useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { getAssessment, getMyAssessments } from "@/entities/analysis/api";
import type { RiskAssessmentResponse } from "@/entities/analysis/api";
import { RECENT_ASSESSMENTS_KEY, badgeLevel } from "@/entities/analysis/model";
import { useAuth } from "@/entities/user/AuthProvider";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { useRecentIds } from "@/shared/lib/useRecentIds";
import Badge from "@/shared/ui/Badge";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { historyMessages } from "./messages";

const GUEST_LIMIT = 10;

export default function AnalysisHistoryPage() {
  const t = useMessages(historyMessages);
  const { loggedIn } = useAuth();

  const mine = useQuery({
    queryKey: ["riskAssessments", "mine"],
    queryFn: getMyAssessments,
    enabled: loggedIn,
  });
  const recent = useRecentIds(RECENT_ASSESSMENTS_KEY);
  const local = useQueries({
    queries: (loggedIn ? [] : (recent.data ?? []).slice(0, GUEST_LIMIT)).map((id) => ({
      queryKey: ["riskAssessments", id],
      queryFn: () => getAssessment(id),
      retry: false,
    })),
  });

  const items: RiskAssessmentResponse[] = loggedIn
    ? (mine.data ?? [])
    : local.flatMap((query) => (query.data ? [query.data] : []));
  const loading = loggedIn ? mine.isPending : recent.isPending || local.some((q) => q.isPending);

  const allGuestFailed = !loggedIn && local.length > 0 && local.every((query) => query.isError);

  if ((loggedIn && mine.isError) || allGuestFailed) {
    return (
      <Screen edges={["left", "right"]}>
        <ErrorView
          message={t.loadFailed}
          onRetry={() => (loggedIn ? mine.refetch() : local.forEach((query) => query.refetch()))}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={["left", "right"]}>
      {loggedIn ? null : <Text className="text-small text-gray-650">{t.guestNote}</Text>}
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <Text className="py-10 text-center text-gray-650">{t.empty}</Text>
      ) : (
        items.map((item) => <HistoryItem key={item.assessmentId} item={item} />)
      )}
    </Screen>
  );
}

function HistoryItem({ item }: { item: RiskAssessmentResponse }) {
  const t = useMessages(historyMessages);
  const router = useRouter();
  const level = item.overallRiskLevel;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/analyze/${item.assessmentId}`)}
    >
      <Card className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text weight="semibold">{t.item(item.assessmentId)}</Text>
          <Text className="text-small text-gray-650">
            {item.status === "PROCESSING"
              ? t.processing
              : item.status === "FAILED"
                ? t.failed
                : !item.faceDetected
                  ? t.noFace
                  : t.score(item.overallScore ?? 0)}
          </Text>
        </View>
        {level && item.status === "COMPLETED" && item.faceDetected ? (
          <Badge level={badgeLevel[level]} />
        ) : null}
      </Card>
    </Pressable>
  );
}
