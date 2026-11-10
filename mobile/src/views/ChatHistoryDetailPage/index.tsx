import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteChatSession, getChatSessionMessages } from "@/entities/chat/api";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Text from "@/shared/ui/Text";
import ChatMessageBubble from "@/widgets/chat/ChatMessageBubble";
import type { ChatMessage } from "@/widgets/chat/types";
import { chatHistoryMessages } from "@/views/ChatHistoryPage/messages";
import ScreenHeader from "@/views/ChatHistoryPage/ScreenHeader";

export default function ChatHistoryDetailPage() {
  const t = useMessages(chatHistoryMessages);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const messages = useQuery({
    queryKey: ["chats", "messages", id],
    queryFn: () => getChatSessionMessages(id),
    select: (data): ChatMessage[] =>
      data.messages.map((message, index) => ({
        id: String(index),
        role: message.role === "USER" ? "user" : "bot",
        content: message.content,
      })),
  });

  const remove = useMutation({
    mutationFn: () => deleteChatSession(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chats", "sessions"] });
      queryClient.removeQueries({ queryKey: ["chats", "messages", id] });
      router.replace("/chats");
    },
    onError: (error) => Alert.alert(t.deleteFailed, error.message),
  });

  function confirmDelete() {
    Alert.alert(t.deleteTitle, t.deleteDescription, [
      { text: t.cancel, style: "cancel" },
      { text: t.deleteConfirm, style: "destructive", onPress: () => remove.mutate() },
    ]);
  }

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-white">
      <ScreenHeader title={t.detailTitle} />
      {messages.isPending ? (
        <Loading />
      ) : messages.isError ? (
        <ErrorView message={t.messagesFailed} onRetry={() => messages.refetch()} />
      ) : (
        <>
          <FlatList
            className="flex-1"
            data={messages.data}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-4 px-5 py-4"
            ListEmptyComponent={<Text className="text-gray-650">{t.noMessages}</Text>}
            renderItem={({ item }) => <ChatMessageBubble message={item} />}
          />
          <View className="gap-2 border-t border-gray-300 px-5 py-3">
            <Button
              title={t.resume}
              onPress={() => router.navigate({ pathname: "/chat", params: { sessionId: id } })}
            />
            <Button
              title={t.delete}
              variant="outline"
              loading={remove.isPending}
              onPress={confirmDelete}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
