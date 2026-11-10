import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { Pressable, View } from "react-native";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Text from "./Text";
import { uiMessages } from "./messages";

interface ScreenHeaderProps {
  title: string;
  /** 돌아갈 화면이 없을 때(바로 열린 경우) 이동할 곳. */
  fallbackHref: Href;
}

/** 탭 밖(스택) 화면 위쪽의 뒤로 가기 + 제목 줄. */
export default function ScreenHeader({ title, fallbackHref }: ScreenHeaderProps) {
  const t = useMessages(uiMessages);
  const router = useRouter();
  return (
    <View className="flex-row items-center gap-1 border-b border-gray-300 px-3 py-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.back}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackHref))}
        hitSlop={4}
        className="size-11 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={24} color={colors.gray900} />
      </Pressable>
      <Text weight="bold" className="flex-1 text-body-1" numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
