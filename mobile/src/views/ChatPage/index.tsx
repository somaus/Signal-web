import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getChatSessionMessages } from "@/entities/chat/api";
import { useAuth } from "@/entities/user/AuthProvider";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Text from "@/shared/ui/Text";
import ChatMessageBubble from "@/widgets/chat/ChatMessageBubble";
import type { ChatMessage } from "@/widgets/chat/types";
import AgencySheet from "./AgencySheet";
import type { AgencySheetState } from "./AgencySheet";
import ChatSummaryCard, { SummaryProgress } from "./ChatSummaryCard";
import { chatMessages } from "./messages";
import SheetModal from "./SheetModal";
import { useChatSession } from "./useChatSession";

export default function ChatPage() {
  const t = useMessages(chatMessages);
  const router = useRouter();
  const { loggedIn } = useAuth();
  // 내 대화 내역에서 "이어서 대화하기"로 들어오면 이전 세션 ID가 넘어온다.
  const { sessionId: resumeId } = useLocalSearchParams<{ sessionId?: string }>();
  const [draft, setDraft] = useState("");
  const [agencySheet, setAgencySheet] = useState<AgencySheetState | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  // 위급 신호가 오면 도움 받을 곳을 바로 띄운다.
  const chat = useChatSession(loggedIn, {
    onCrisis: () => setAgencySheet({ situationType: "CRISIS" }),
  });
  const { resume, resumedId } = chat;

  const history = useQuery({
    queryKey: ["chats", "messages", resumeId],
    queryFn: () => getChatSessionMessages(resumeId as string),
    enabled: Boolean(resumeId),
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!resumeId || !history.data || history.isFetching) return;
    if (resumedId === resumeId) return;
    void resume(resumeId, history.data.messages);
  }, [resumeId, resumedId, history.data, history.isFetching, resume]);

  function startNewChat() {
    chat.reset();
    setDraft("");
    if (resumeId) router.setParams({ sessionId: undefined });
  }

  function confirmNewChat() {
    if (!chat.hasStarted) return;
    // 이어가는 상담은 저장 여부를 앱에서 알 수 없어서 저장됐다고 단정하지 않는다.
    const description = resumedId
      ? t.resetResumed
      : loggedIn && chat.saveConsent
        ? t.resetSaved
        : t.resetUnsaved;
    Alert.alert(t.resetTitle, description, [
      { text: t.cancel, style: "cancel" },
      { text: t.restart, onPress: startNewChat },
    ]);
  }

  function submit(content: string) {
    if (!content.trim()) return;
    setDraft("");
    void chat.send(content);
  }

  function openAgencies() {
    setAgencySheet({
      situationType: chat.situationType === "IMAGE_ABUSE" ? "IMAGE_ABUSE" : undefined,
    });
  }

  const canSubmit = draft.trim().length > 0 && !chat.isSending;
  const resuming = Boolean(resumeId) && resumedId !== resumeId && !history.isError;

  const greeting = (
    <View className="gap-4 pb-2">
      <ChatMessageBubble message={{ id: "greeting", role: "bot", content: t.greeting }} />
      {!chat.hasStarted ? (
        <>
          <View className="flex-row flex-wrap gap-2">
            {t.quickReplies.map((reply) => (
              <Pressable
                key={reply}
                accessibilityRole="button"
                disabled={chat.isSending}
                onPress={() => submit(reply)}
                className="min-h-10 justify-center rounded-full border border-primary-300 bg-primary-50 px-4 active:bg-primary-100"
              >
                <Text className="text-small text-primary-600">{reply}</Text>
              </Pressable>
            ))}
          </View>
          <Card>
            <Text className="text-small text-gray-700">{t.privacy.anonymous}</Text>
            {loggedIn ? (
              <View className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text weight="semibold" className="text-small">
                    {t.privacy.saveHistory}
                  </Text>
                  <Switch
                    accessibilityLabel={t.privacy.saveHistory}
                    value={chat.saveConsent}
                    onValueChange={chat.setSaveConsent}
                    trackColor={{ true: colors.primary600 }}
                  />
                </View>
                <Text className="text-caption text-gray-650">{t.privacy.saveHint}</Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-between gap-3">
                <Text className="flex-1 text-small text-gray-650">{t.privacy.guestNotSaved}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/login")}
                  hitSlop={8}
                  className="min-h-10 justify-center"
                >
                  <Text weight="semibold" className="text-small text-primary-600 underline">
                    {t.privacy.login}
                  </Text>
                </Pressable>
              </View>
            )}
          </Card>
        </>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-gray-300 px-5 py-2">
        <Text weight="bold" className="text-body-1">
          {t.title}
        </Text>
        <View className="flex-row">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.myChats}
            onPress={() => router.push("/chats")}
            hitSlop={4}
            className="size-11 items-center justify-center"
          >
            <Ionicons name="time-outline" size={24} color={colors.gray900} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.newChat}
            accessibilityState={{ disabled: !chat.hasStarted }}
            onPress={confirmNewChat}
            hitSlop={4}
            className="size-11 items-center justify-center"
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={chat.hasStarted ? colors.gray900 : colors.gray600}
            />
          </Pressable>
        </View>
      </View>

      {chat.summary ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.summary.open}
          onPress={() => setSummaryOpen(true)}
          className="gap-1 border-b border-gray-300 bg-primary-50 px-5 py-3 active:bg-primary-100"
        >
          <SummaryProgress summary={chat.summary} />
        </Pressable>
      ) : null}

      {resumeId && history.isError ? (
        <ErrorView message={t.historyFailed} onRetry={() => history.refetch()} />
      ) : resuming ? (
        <Loading message={t.loadingHistory} />
      ) : (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            ref={listRef}
            className="flex-1"
            data={chat.messages}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-4 px-5 py-4"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            ListHeaderComponent={greeting}
            renderItem={({ item }) => (
              <ChatMessageBubble
                message={item}
                onOpenAgencies={openAgencies}
                onRetry={(message) => void chat.send(message.content, message.id)}
              />
            )}
            ListFooterComponent={
              chat.isSending ? (
                <View
                  className="flex-row items-center gap-2"
                  accessibilityLiveRegion="polite"
                  accessibilityLabel={t.typing}
                >
                  <ActivityIndicator color={colors.gray600} />
                  <Text className="text-small text-gray-650">{t.typing}</Text>
                </View>
              ) : undefined
            }
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />

          {chat.crisisDetected ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.crisis.open}
              onPress={() => setAgencySheet({ situationType: "CRISIS" })}
              className="flex-row items-center gap-3 border-t border-red-200 bg-red-50 px-5 py-3 active:bg-red-100"
            >
              <Ionicons name="warning-outline" size={22} color="#dc2626" />
              <View className="flex-1">
                <Text className="text-small text-red-700">{t.crisis.banner}</Text>
                <Text weight="semibold" className="text-small text-red-700 underline">
                  {t.crisis.open}
                </Text>
              </View>
            </Pressable>
          ) : null}

          {chat.isClosing ? (
            <View className="gap-3 border-t border-gray-300 px-5 py-4">
              <Text className="text-small text-gray-700">{t.ended.notice}</Text>
              <Button title={t.ended.newChat} onPress={startNewChat} />
            </View>
          ) : (
            <View className="flex-row items-end gap-2 border-t border-gray-300 px-5 py-3">
              <TextInput
                accessibilityLabel={t.placeholder}
                placeholder={t.placeholder}
                placeholderTextColor={colors.gray600}
                value={draft}
                onChangeText={setDraft}
                multiline
                maxLength={2000}
                className="max-h-28 min-h-12 flex-1 rounded border border-gray-500 px-3 py-2 font-pretendard text-body-2 text-gray-900"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.send}
                accessibilityState={{ disabled: !canSubmit }}
                disabled={!canSubmit}
                onPress={() => submit(draft)}
                className={cn(
                  "size-12 items-center justify-center rounded",
                  canSubmit ? "bg-primary-600 active:bg-primary-900" : "bg-gray-200",
                )}
              >
                <Ionicons
                  name="arrow-up"
                  size={22}
                  color={canSubmit ? colors.white : colors.gray600}
                />
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      )}

      <SheetModal
        visible={summaryOpen && chat.summary !== null}
        title={t.summary.title}
        onClose={() => setSummaryOpen(false)}
      >
        {chat.summary ? (
          <ChatSummaryCard summary={chat.summary} stale={chat.summaryFailed} />
        ) : null}
      </SheetModal>

      <AgencySheet state={agencySheet} onClose={() => setAgencySheet(null)} />
    </SafeAreaView>
  );
}
