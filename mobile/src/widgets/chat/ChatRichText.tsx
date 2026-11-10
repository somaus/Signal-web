import { Fragment } from "react";
import { Alert, Linking, Text as RNText, View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Text from "@/shared/ui/Text";
import { isHotline, parseChatMarkdown } from "./chatMarkdown";
import type { Inline } from "./chatMarkdown";
import { chatBubbleMessages } from "./messages";

export function callPhone(digits: string, failedMessage: string) {
  Linking.openURL(`tel:${digits}`).catch(() => Alert.alert(failedMessage));
}

function InlineLine({ line }: { line: Inline[] }) {
  const t = useMessages(chatBubbleMessages);
  return (
    <>
      {line.map((inline, index) =>
        isHotline(line, index) ? (
          <RNText
            key={index}
            accessibilityRole="link"
            accessibilityLabel={t.call(inline.text)}
            onPress={() => callPhone(inline.text.replace(/-/g, ""), t.callFailed)}
            className="font-pretendard-bold text-primary-500 underline"
          >
            {inline.text}
          </RNText>
        ) : inline.bold ? (
          <RNText key={index} className="font-pretendard-bold text-primary-500">
            {inline.text}
          </RNText>
        ) : (
          <Fragment key={index}>{inline.text}</Fragment>
        ),
      )}
    </>
  );
}

/** 봇 답변을 문단·목록으로 나눠 보여주고, 굵게 표시된 전화번호는 눌러서 전화를 건다. */
export default function ChatRichText({ content }: { content: string }) {
  const blocks = parseChatMarkdown(content);
  return (
    <View className="gap-3">
      {blocks.map((block, blockIndex) => {
        if ("lines" in block) {
          return (
            <Text key={blockIndex} weight={block.kind === "heading" ? "bold" : "regular"}>
              {block.lines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 ? "\n" : null}
                  <InlineLine line={line} />
                </Fragment>
              ))}
            </Text>
          );
        }
        return (
          <View key={blockIndex} className="gap-1">
            {block.items.map((item, i) => (
              <View key={i} className="flex-row gap-2">
                <Text className="w-5 text-right">
                  {block.kind === "bullet" ? "•" : `${i + 1}.`}
                </Text>
                <Text className="flex-1">
                  <InlineLine line={item} />
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
