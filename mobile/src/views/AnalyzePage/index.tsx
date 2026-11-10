import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { createRiskAssessment, getAssessment } from "@/entities/analysis/api";
import { RECENT_ASSESSMENTS_KEY } from "@/entities/analysis/model";
import { ApiError } from "@/shared/api/axios";
import { useMessages } from "@/shared/i18n/I18nProvider";
import type { PickedImage } from "@/shared/lib/pickImage";
import { pushRecentId } from "@/shared/lib/recentIds";
import { recentIdsKey, useRecentIds } from "@/shared/lib/useRecentIds";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import ImagePickerCard from "@/widgets/ImagePickerCard";
import { analyzeMessages } from "./messages";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function needsLogin(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.code === "UNAUTHORIZED" ||
      error.code === "ANONYMOUS_ID_REQUIRED" ||
      error.code === "ANONYMOUS_RISK_ASSESSMENT_LIMIT_EXCEEDED")
  );
}

export default function AnalyzePage() {
  const t = useMessages(analyzeMessages);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<PickedImage | null>(null);

  const recent = useRecentIds(RECENT_ASSESSMENTS_KEY);
  const lastId = recent.data?.[0];
  const last = useQuery({
    queryKey: ["riskAssessments", lastId],
    queryFn: () => getAssessment(lastId as number),
    enabled: lastId !== undefined,
    retry: false,
  });

  const analyze = useMutation({
    mutationFn: createRiskAssessment,
    onSuccess: async (created) => {
      await pushRecentId(RECENT_ASSESSMENTS_KEY, created.assessmentId);
      queryClient.setQueryData(["riskAssessments", created.assessmentId], created);
      await queryClient.invalidateQueries({ queryKey: recentIdsKey(RECENT_ASSESSMENTS_KEY) });
      setImage(null);
      router.push(`/analyze/${created.assessmentId}`);
    },
  });

  const pending = analyze.isPending;

  return (
    <Screen scroll>
      <View className="gap-1">
        <Text weight="bold" className="text-h3">
          {t.title}
        </Text>
        <Text className="text-small text-gray-650">{t.description}</Text>
      </View>

      {last.data?.status === "PROCESSING" && lastId !== undefined ? (
        <Card>
          <Text weight="semibold">{t.resumeTitle}</Text>
          <Text className="text-small text-gray-650">{t.resumeDescription}</Text>
          <Button
            title={t.resume}
            variant="outline"
            onPress={() => router.push(`/analyze/${lastId}`)}
          />
        </Card>
      ) : null}

      <ImagePickerCard
        image={image}
        onPick={(picked) => {
          analyze.reset();
          setImage(picked);
        }}
        disabled={pending}
        maxBytes={MAX_IMAGE_BYTES}
      />

      {analyze.isError ? (
        <Card className="border-red-500 bg-red-50">
          <Text weight="semibold" className="text-red-500">
            {t.failed}
          </Text>
          <Text className="text-small text-gray-800">{analyze.error.message}</Text>
          {needsLogin(analyze.error) ? (
            <Button title={t.login} variant="outline" onPress={() => router.push("/login")} />
          ) : null}
        </Card>
      ) : null}

      <Button
        title={pending ? t.uploading : t.start}
        loading={pending}
        disabled={!image}
        onPress={() => image && analyze.mutate(image)}
      />

      <Button title={t.history} variant="outline" onPress={() => router.push("/analyze/history")} />
    </Screen>
  );
}
