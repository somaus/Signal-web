import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { getDeepfakeDetection } from "@/entities/detection/api";
import type { DeepfakeBand, DeepfakeDetectionResponse } from "@/entities/detection/api";
import {
  bandCaption,
  bandStyle,
  detectionMessages,
  evidenceItems,
  resolveBand,
} from "@/entities/detection/model";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { usePollTimeout } from "@/shared/lib/usePollTimeout";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { detectResultMessages } from "./messages";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 120_000;
const SCALE_BANDS = ["LOW", "UNCERTAIN", "HIGH"] as const;

interface DetectResultPageProps {
  detectionId: number;
}

export default function DetectResultPage({ detectionId }: DetectResultPageProps) {
  const t = useMessages(detectResultMessages);
  const router = useRouter();

  const query = useQuery({
    queryKey: ["deepfakeDetections", detectionId],
    queryFn: () => getDeepfakeDetection(detectionId),
    enabled: Number.isInteger(detectionId),
    refetchInterval: (q) => (q.state.data?.status === "PROCESSING" ? POLL_INTERVAL_MS : false),
  });

  const { timedOut, restart } = usePollTimeout(
    query.data?.status === "PROCESSING",
    POLL_TIMEOUT_MS,
  );

  if (!Number.isInteger(detectionId)) {
    return (
      <Screen edges={["left", "right"]}>
        <ErrorView message={t.invalidId} />
      </Screen>
    );
  }

  const data = query.data;

  let body;
  if (query.isError && !data) {
    body = <ErrorView message={query.error.message} onRetry={() => query.refetch()} />;
  } else if (!data) {
    body = <Loading />;
  } else if (timedOut) {
    body = (
      <ErrorView
        message={t.timeout}
        onRetry={() => {
          restart();
          void query.refetch();
        }}
      />
    );
  } else if (data.status === "PROCESSING") {
    body = <Loading message={`${t.processing}\n${t.processingCaption}`} />;
  } else if (data.status === "FAILED") {
    body = <FailureView data={data} onRetryPhoto={() => router.replace("/detect")} />;
  } else {
    body = <ResultView data={data} />;
  }

  return (
    <Screen scroll edges={["left", "right"]}>
      <Text className="text-caption text-gray-650">{t.meta(detectionId)}</Text>
      {body}
    </Screen>
  );
}

function FailureView({
  data,
  onRetryPhoto,
}: {
  data: DeepfakeDetectionResponse;
  onRetryPhoto: () => void;
}) {
  const t = useMessages(detectResultMessages);
  const messages = useMessages(detectionMessages);
  const failure =
    (data.failureReason && messages.failure[data.failureReason]) || messages.unknownFailure;
  return (
    <Card className="items-center gap-3 py-8">
      <Text weight="bold" className="text-center text-body-1">
        {failure.title}
      </Text>
      <Text className="text-center text-small text-gray-650">{failure.description}</Text>
      <Button title={t.retryPhoto} onPress={onRetryPhoto} className="self-stretch" />
    </Card>
  );
}

function BandScale({ band, label }: { band: DeepfakeBand; label: string }) {
  const messages = useMessages(detectionMessages);
  return (
    <View className="w-full gap-4" accessibilityLabel={label}>
      <Text weight="bold" className={cn("text-center text-h3", bandStyle[band].text)}>
        {label}
      </Text>
      <View className="w-full flex-row gap-1.5">
        {SCALE_BANDS.map((scaleBand) => {
          const active = scaleBand === band;
          return (
            <View key={scaleBand} className="flex-1 items-center gap-2">
              <View
                className={cn(
                  "h-2.5 w-full rounded-full",
                  active ? bandStyle[scaleBand].bar : "bg-gray-200",
                )}
              />
              <Text
                weight={active ? "semibold" : "regular"}
                className={cn("text-caption", active ? bandStyle[scaleBand].text : "text-gray-650")}
              >
                {messages.bandLevel[scaleBand]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ResultView({ data }: { data: DeepfakeDetectionResponse }) {
  const t = useMessages(detectResultMessages);
  const messages = useMessages(detectionMessages);
  const router = useRouter();
  const band = resolveBand(data);
  const evidences = evidenceItems(data, messages);

  return (
    <>
      <Card className="items-center gap-4 py-6">
        <BandScale band={band} label={messages.band[band]} />
        {data.riskScore != null ? (
          <View className="items-center">
            <Text className="text-small text-gray-650">{t.probability}</Text>
            <Text weight="bold" className={cn("text-h2", bandStyle[band].text)}>
              {t.percent(data.riskScore)}
            </Text>
          </View>
        ) : null}
        <Text className="text-center text-small text-gray-800">
          {bandCaption(data, band, messages)}
        </Text>
        {data.modelName ? (
          <Text className="text-center text-caption text-gray-650">
            {messages.modelLabel(data.modelName, data.modelVersion ?? null)}
          </Text>
        ) : null}
      </Card>

      {data.fallbackUsed ? (
        <Card className="border-yellow-500 bg-yellow-50">
          <Text className="text-small text-gray-800">{messages.fallbackNote}</Text>
        </Card>
      ) : null}

      <View className="gap-3">
        <Text weight="bold" className="text-body-1">
          {t.evidenceTitle}
        </Text>
        {evidences.length > 0 ? (
          evidences.map((item, index) => (
            <Card key={`${item.title}-${index}`}>
              <Text weight="semibold">{item.title}</Text>
              <Text className="text-small text-gray-650">{item.description}</Text>
            </Card>
          ))
        ) : (
          <Card>
            <Text className="text-small text-gray-650">{messages.noEvidence}</Text>
          </Card>
        )}
      </View>

      <Card className="border-secondary-200 bg-secondary-50">
        <Text weight="semibold">{t.limitTitle}</Text>
        <Text className="text-small text-gray-800">{t.limit}</Text>
      </Card>

      <Button title={t.startChat} onPress={() => router.push("/chat")} />
      <Button title={t.report} variant="outline" onPress={() => router.push("/report")} />
      <Button title={t.again} variant="outline" onPress={() => router.replace("/detect")} />
    </>
  );
}
