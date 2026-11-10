import { useQueries } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { getDeepfakeDetection } from "@/entities/detection/api";
import type { DeepfakeDetectionResponse } from "@/entities/detection/api";
import {
  RECENT_DETECTIONS_KEY,
  bandStyle,
  detectionMessages,
  resolveBand,
} from "@/entities/detection/model";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import { useRecentIds } from "@/shared/lib/useRecentIds";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { detectHistoryMessages } from "./messages";

const LIMIT = 10;

export default function DetectHistoryPage() {
  const t = useMessages(detectHistoryMessages);
  const recent = useRecentIds(RECENT_DETECTIONS_KEY);
  const queries = useQueries({
    queries: (recent.data ?? []).slice(0, LIMIT).map((id) => ({
      queryKey: ["deepfakeDetections", id],
      queryFn: () => getDeepfakeDetection(id),
      retry: false,
    })),
  });

  // 다른 계정으로 만든 기록처럼 지금 조회할 수 없는 번호는 목록에서 뺀다.
  const items = queries.flatMap((query) => (query.data ? [query.data] : []));
  const loading = recent.isPending || queries.some((query) => query.isPending);
  const allFailed = queries.length > 0 && queries.every((query) => query.isError);

  if (allFailed) {
    return (
      <Screen edges={["left", "right"]}>
        <ErrorView
          message={t.loadFailed}
          onRetry={() => queries.forEach((query) => query.refetch())}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={["left", "right"]}>
      <Text className="text-small text-gray-650">{t.note}</Text>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <Text className="py-10 text-center text-gray-650">{t.empty}</Text>
      ) : (
        items.map((item) => <HistoryItem key={item.detectionId} item={item} />)
      )}
    </Screen>
  );
}

function HistoryItem({ item }: { item: DeepfakeDetectionResponse }) {
  const t = useMessages(detectHistoryMessages);
  const messages = useMessages(detectionMessages);
  const router = useRouter();
  const band = resolveBand(item);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/detect/${item.detectionId}`)}
    >
      <Card className="flex-row items-center justify-between">
        <Text weight="semibold">{t.item(item.detectionId)}</Text>
        {item.status === "COMPLETED" ? (
          <View className={cn("rounded-full px-2.5 py-1", bandStyle[band].bg)}>
            <Text weight="bold" className={cn("text-caption", bandStyle[band].text)}>
              {messages.band[band]}
            </Text>
          </View>
        ) : (
          <Text className="text-small text-gray-650">
            {item.status === "PROCESSING" ? t.processing : t.failed}
          </Text>
        )}
      </Card>
    </Pressable>
  );
}
