import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Text from "@/shared/ui/Text";
import ChatRichText from "./ChatRichText";
import { chatBubbleMessages } from "./messages";
import type { ChatMessage } from "./types";

// 웹과 같은 기준: 답변에 신고 얘기가 나오면 신고서 작성으로 이어 준다.
const REPORT_PATTERN = /신고|report/i;

interface ChatMessageBubbleProps {
  message: ChatMessage;
  /** 넘기면 봇 답변 아래에 "전문 기관 연결하기"·"신고 문서 작성하기" 버튼이 붙는다. */
  onOpenAgencies?: () => void;
  onRetry?: (message: ChatMessage) => void;
}

export default function ChatMessageBubble({
  message,
  onOpenAgencies,
  onRetry,
}: ChatMessageBubbleProps) {
  const t = useMessages(chatBubbleMessages);
  const router = useRouter();

  if (message.role === "user") {
    return (
      <View className="items-end gap-1">
        <View
          className={cn(
            "max-w-[85%] rounded-2xl rounded-br-sm bg-primary-600 px-4 py-3",
            message.status === "sending" && "opacity-60",
          )}
        >
          <Text className="text-white">{message.content}</Text>
        </View>
        {message.status === "sending" ? (
          <Text className="text-caption text-gray-650">{t.sending}</Text>
        ) : null}
        {message.status === "failed" ? (
          <View className="items-end gap-1" accessibilityRole="alert">
            <Text className="text-caption text-red-600">{message.error ?? t.sendFailed}</Text>
            {onRetry ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => onRetry(message)}
                hitSlop={8}
                className="min-h-8 justify-center"
              >
                <Text weight="semibold" className="text-small text-primary-600 underline">
                  {t.retry}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }

  const showReport = onOpenAgencies !== undefined && REPORT_PATTERN.test(message.content);
  const showAgencies = onOpenAgencies !== undefined && message.hasAgencies === true;

  return (
    <View className="items-start gap-2">
      <Text className="text-caption text-gray-650">{t.counselor}</Text>
      <View className="max-w-[92%] rounded-2xl rounded-tl-sm bg-gray-200 px-4 py-3">
        <ChatRichText content={message.content} />
      </View>
      {showAgencies || showReport ? (
        <View className="flex-row flex-wrap gap-2">
          {showAgencies ? (
            <Button
              title={t.referral}
              variant="outline"
              onPress={onOpenAgencies}
              className="min-h-10 px-3 py-1.5"
            />
          ) : null}
          {showReport ? (
            <Button
              title={t.writeReport}
              variant="outline"
              onPress={() => router.navigate("/report")}
              className="min-h-10 px-3 py-1.5"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
