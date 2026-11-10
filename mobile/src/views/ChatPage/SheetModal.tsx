import { Modal, Pressable, ScrollView, View } from "react-native";
import type { PropsWithChildren } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Text from "@/shared/ui/Text";
import { chatMessages } from "./messages";

interface SheetModalProps extends PropsWithChildren {
  visible: boolean;
  title: string;
  onClose: () => void;
}

/** 아래에서 올라오는 전체 화면 시트. 요약·기관 목록처럼 길 수 있는 내용에 쓴다. */
export default function SheetModal({ visible, title, onClose, children }: SheetModalProps) {
  const t = useMessages(chatMessages);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom", "left", "right"]}>
        <View className="flex-row items-center justify-between border-b border-gray-300 px-5 py-3">
          <Text weight="bold" className="text-body-1">
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.close}
            onPress={onClose}
            hitSlop={8}
            className="size-10 items-center justify-center"
          >
            <Ionicons name="close" size={24} color={colors.gray900} />
          </Pressable>
        </View>
        <ScrollView contentContainerClassName="gap-4 px-5 py-6" keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
