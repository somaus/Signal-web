import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteReport, finalizeReport, getReport } from "@/entities/report/api";
import type { ReportResponse } from "@/entities/report/model";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { formatDate } from "@/shared/lib/formatDate";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import ScreenHeader from "@/shared/ui/ScreenHeader";
import Text from "@/shared/ui/Text";
import { reportHistoryMessages } from "@/views/ReportHistoryPage/messages";
import ReportDocumentButton from "@/widgets/report/ReportDocumentButton";
import ReportFieldList from "@/widgets/report/ReportFieldList";
import ReportSummary from "@/widgets/report/ReportSummary";

export default function ReportDetailPage() {
  const t = useMessages(reportHistoryMessages);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reportId = Number(id);
  const validId = Number.isInteger(reportId) && reportId > 0;
  const queryKey = ["reports", reportId];

  const report = useQuery({
    queryKey,
    queryFn: () => getReport(reportId),
    enabled: validId,
  });

  const finalize = useMutation({
    mutationFn: () => finalizeReport(reportId),
    onSuccess: async (result) => {
      queryClient.setQueryData<ReportResponse>(queryKey, (current) =>
        current ? { ...current, status: result.status } : current,
      );
      // 확정할 때 서버가 요약을 다시 만들 수 있어서 새로 받는다.
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => Alert.alert(t.finalizeFailed, error.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteReport(reportId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      router.replace("/reports");
    },
    onError: (error) => Alert.alert(t.deleteFailed, error.message),
  });

  function confirmFinalize() {
    Alert.alert(t.finalizeTitle, t.finalizeDescription, [
      { text: t.cancel, style: "cancel" },
      { text: t.finalizeConfirm, onPress: () => finalize.mutate() },
    ]);
  }

  function confirmDelete() {
    Alert.alert(t.deleteTitle, t.deleteDescription, [
      { text: t.cancel, style: "cancel" },
      { text: t.deleteConfirm, style: "destructive", onPress: () => remove.mutate() },
    ]);
  }

  const data = report.data;
  const finalized = data?.status === "FINALIZED";
  const busy = finalize.isPending || remove.isPending;

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-white">
      <ScreenHeader title={t.detailTitle} fallbackHref="/reports" />
      {!validId ? (
        <ErrorView message={t.invalidId} />
      ) : report.isPending ? (
        <Loading />
      ) : report.isError || !data ? (
        <ErrorView message={t.detailLoadFailed} onRetry={() => report.refetch()} />
      ) : (
        <ScrollView contentContainerClassName="gap-4 px-5 py-6">
          <View className="gap-1">
            <Text weight="bold" className="text-body-1">
              {t.itemTitle(data.damageType ?? t.itemFallback)}
            </Text>
            <Text className="text-small text-gray-650">
              {`${t.created(formatDate(data.createdAt))} · ${finalized ? t.finalized : t.drafting}`}
            </Text>
          </View>

          <View
            className={
              finalized ? "rounded-xl bg-primary-50 p-3" : "rounded-xl bg-secondary-50 p-3"
            }
          >
            <Text
              className={
                finalized ? "text-small text-primary-600" : "text-small text-secondary-900"
              }
            >
              {finalized ? t.finalizedNotice : t.draftNotice}
            </Text>
          </View>

          <ReportSummary summary={data.summary} />
          <ReportDocumentButton reportId={reportId} variant="primary" disabled={busy} />

          <Card>
            <ReportFieldList
              emptyText={t.fields.empty}
              fields={[
                { label: t.fields.damageType, value: data.damageType },
                { label: t.fields.incidentDate, value: data.incidentDate },
                { label: t.fields.route, value: data.discoveryRoute },
                { label: t.fields.url, value: data.sourceUrls?.[0] },
                { label: t.fields.description, value: data.description },
                { label: t.fields.notes, value: data.additionalNotes },
                {
                  label: t.fields.evidence,
                  value: data.evidenceIds?.length
                    ? t.fields.evidenceCount(data.evidenceIds.length)
                    : undefined,
                },
              ]}
            />
          </Card>

          {!finalized ? (
            <Button
              title={t.finalize}
              loading={finalize.isPending}
              disabled={remove.isPending}
              onPress={confirmFinalize}
            />
          ) : null}
          <Button
            title={t.delete}
            variant="outline"
            loading={remove.isPending}
            disabled={finalize.isPending}
            onPress={confirmDelete}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
