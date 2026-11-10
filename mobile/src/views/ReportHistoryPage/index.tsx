import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyReports } from "@/entities/report/api";
import { useAuth } from "@/entities/user/AuthProvider";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/formatDate";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import ScreenHeader from "@/shared/ui/ScreenHeader";
import Text from "@/shared/ui/Text";
import { reportHistoryMessages } from "./messages";

export default function ReportHistoryPage() {
  const t = useMessages(reportHistoryMessages);
  const router = useRouter();
  const { loggedIn } = useAuth();

  const reports = useQuery({
    queryKey: ["reports"],
    queryFn: getMyReports,
    enabled: loggedIn,
    select: (data) =>
      [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-white">
      <ScreenHeader title={t.title} fallbackHref="/report" />
      {!loggedIn ? (
        <View className="p-5">
          <Card>
            <Text className="text-small text-gray-650">{t.guest}</Text>
            <Button title={t.login} onPress={() => router.push("/login")} />
          </Card>
        </View>
      ) : reports.isPending ? (
        <Loading />
      ) : reports.isError ? (
        <ErrorView message={t.loadFailed} onRetry={() => reports.refetch()} />
      ) : (
        <FlatList
          data={reports.data}
          keyExtractor={(item) => String(item.reportId)}
          contentContainerClassName="gap-3 px-5 py-4"
          refreshing={reports.isRefetching}
          onRefresh={() => reports.refetch()}
          ListEmptyComponent={
            <Card>
              <Text weight="semibold">{t.empty}</Text>
              <Button title={t.write} onPress={() => router.navigate("/report")} />
            </Card>
          }
          renderItem={({ item }) => {
            const finalized = item.status === "FINALIZED";
            return (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/reports/${item.reportId}`)}
                className="flex-row items-center justify-between gap-3 rounded-xl border border-gray-300 bg-white p-4 active:bg-gray-100"
              >
                <View className="flex-1 gap-1">
                  <Text weight="semibold" numberOfLines={1}>
                    {t.itemTitle(item.damageType ?? t.itemFallback)}
                  </Text>
                  <Text className="text-small text-gray-650">
                    {t.created(formatDate(item.createdAt))}
                  </Text>
                </View>
                <Text
                  weight="semibold"
                  className={cn(
                    "text-caption",
                    finalized ? "text-primary-600" : "text-secondary-900",
                  )}
                >
                  {finalized ? t.finalized : t.drafting}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
