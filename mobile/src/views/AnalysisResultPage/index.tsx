import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { getAssessment } from "@/entities/analysis/api";
import type { RiskAssessmentResponse } from "@/entities/analysis/api";
import {
  assessmentMessages,
  badgeLevel,
  factorLabel,
  levelBarClass,
  levelTextClass,
} from "@/entities/analysis/model";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { usePollTimeout } from "@/shared/lib/usePollTimeout";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Screen from "@/shared/ui/Screen";
import ScoreBar from "@/shared/ui/ScoreBar";
import Text from "@/shared/ui/Text";
import { resultMessages } from "./messages";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 120_000;

interface AnalysisResultPageProps {
  assessmentId: number;
}

export default function AnalysisResultPage({ assessmentId }: AnalysisResultPageProps) {
  const t = useMessages(resultMessages);
  const router = useRouter();

  const query = useQuery({
    queryKey: ["riskAssessments", assessmentId],
    queryFn: () => getAssessment(assessmentId),
    enabled: Number.isInteger(assessmentId),
    refetchInterval: (q) => (q.state.data?.status === "PROCESSING" ? POLL_INTERVAL_MS : false),
  });

  const { timedOut, restart } = usePollTimeout(
    query.data?.status === "PROCESSING",
    POLL_TIMEOUT_MS,
  );

  if (!Number.isInteger(assessmentId)) {
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
        message={`${t.timeout}. ${t.timeoutDescription}`}
        onRetry={() => {
          restart();
          void query.refetch();
        }}
      />
    );
  } else if (data.status === "PROCESSING") {
    body = <Loading message={`${t.processing}\n${t.processingCaption}`} />;
  } else if (data.status === "FAILED" || !data.faceDetected) {
    body = <FailureView data={data} onRetryPhoto={() => router.replace("/analyze")} />;
  } else {
    body = <ResultView data={data} />;
  }

  return (
    <Screen scroll edges={["left", "right"]}>
      <Text className="text-caption text-gray-650">{t.meta(assessmentId)}</Text>
      {body}
    </Screen>
  );
}

function FailureView({
  data,
  onRetryPhoto,
}: {
  data: RiskAssessmentResponse;
  onRetryPhoto: () => void;
}) {
  const t = useMessages(resultMessages);
  const messages = useMessages(assessmentMessages);
  // 얼굴이 없어 끝난 분석은 FAILED 대신 faceDetected=false로 올 수도 있다.
  const failure = data.failureReason
    ? (messages.failure[data.failureReason] ?? messages.unknownFailure)
    : data.status === "FAILED"
      ? messages.unknownFailure
      : messages.failure.NO_FACE_DETECTED;
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

function ResultView({ data }: { data: RiskAssessmentResponse }) {
  const t = useMessages(resultMessages);
  const messages = useMessages(assessmentMessages);
  const router = useRouter();
  const level = data.overallRiskLevel;

  return (
    <>
      {level ? (
        <Card className="items-center gap-3 py-6">
          <Text weight="semibold" className="text-gray-650">
            {t.overallTitle}
          </Text>
          <Badge level={badgeLevel[level]} />
          <Text weight="bold" className={`text-h2 ${levelTextClass[level]}`}>
            {data.overallScore ?? 0}
            <Text weight="semibold" className="text-h3 text-gray-650">
              {t.scoreSuffix}
            </Text>
          </Text>
          <ScoreBar score={data.overallScore ?? 0} barClassName={levelBarClass[level]} />
          <Text className="text-center text-small text-gray-800">
            {messages.levelDescription[level]}
          </Text>
        </Card>
      ) : null}

      {data.fallbackUsed ? (
        <Card className="border-yellow-500 bg-yellow-50">
          <Text className="text-small text-gray-800">{messages.fallbackNote}</Text>
        </Card>
      ) : null}

      {data.factors.length > 0 ? (
        <View className="gap-3">
          <Text weight="bold" className="text-body-1">
            {t.factorsTitle}
          </Text>
          {data.factors.map((factor) => (
            <Card key={factor.type}>
              <View className="flex-row items-center justify-between gap-2">
                <Text weight="semibold" className="flex-1">
                  {factorLabel(factor, messages.factorLabels)}
                </Text>
                <Text weight="bold" className="text-gray-700">
                  {factor.score}
                </Text>
              </View>
              <ScoreBar score={factor.score} />
              <Text className="text-small text-gray-650">{factor.description}</Text>
            </Card>
          ))}
        </View>
      ) : null}

      {data.recommendations.length > 0 ? (
        <Card>
          <Text weight="bold" className="text-body-1">
            {t.recommendationsTitle}
          </Text>
          {data.recommendations.map((recommendation) => (
            <Text key={recommendation} className="text-small text-gray-800">
              {`• ${recommendation}`}
            </Text>
          ))}
        </Card>
      ) : null}

      <Button
        title={t.protect}
        onPress={() => router.push(`/analyze/protect/${data.assessmentId}`)}
      />
      <Button title={t.startChat} variant="outline" onPress={() => router.push("/chat")} />
      <Button title={t.again} variant="outline" onPress={() => router.replace("/analyze")} />
    </>
  );
}
