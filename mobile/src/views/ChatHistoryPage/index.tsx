import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyChatSessions } from "@/entities/chat/api";
import { useAuth } from "@/entities/user/AuthProvider";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Text from "@/shared/ui/Text";
import { formatDate } from "./formatDate";
import { chatHistoryMessages } from "./messages";
import ScreenHeader from "./ScreenHeader";

export default function ChatHistoryPage() {
  const t = useMessages(chatHistoryMessages);
  const router = useRouter();
  const { loggedIn } = useAuth();

  const sessions = useQuery({
    queryKey: ["chats", "sessions"],
    queryFn: getMyChatSessions,
    enabled: loggedIn,
    select: (data) =>
      [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-white">
      <ScreenHeader title={t.title} />
      {!loggedIn ? (
        <View className="gap-3 p-5">
          <Card>
            <Text className="text-small text-gray-650">{t.guest}</Text>
            <Button title={t.login} onPress={() => router.push("/login")} />
          </Card>
        </View>
      ) : sessions.isPending ? (
        <Loading />
      ) : sessions.isError ? (
        <ErrorView message={t.loadFailed} onRetry={() => sessions.refetch()} />
      ) : (
        <FlatList
          data={sessions.data}
          keyExtractor={(item) => item.sessionId}
          contentContainerClassName="gap-3 px-5 py-4"
          refreshing={sessions.isRefetching}
          onRefresh={() => sessions.refetch()}
          ListEmptyComponent={
            <Card>
              <Text weight="semibold">{t.empty}</Text>
              <Text className="text-small text-gray-650">{t.emptyHint}</Text>
              <Button title={t.startChat} onPress={() => router.navigate("/chat")} />
            </Card>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/chats/${item.sessionId}`)}
              className="flex-row items-center justify-between rounded-xl border border-gray-300 bg-white p-4 active:bg-gray-100"
            >
              <View className="gap-1">
                <Text weight="semibold">{t.itemTitle}</Text>
                <Text className="text-small text-gray-650">{formatDate(item.createdAt)}</Text>
              </View>
              <Text
                weight="semibold"
                className={cn(
                  "text-caption",
                  item.saveConsent ? "text-primary-600" : "text-gray-650",
                )}
              >
                {item.saveConsent ? t.saved : t.unsaved}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
