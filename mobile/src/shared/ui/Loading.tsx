import { ActivityIndicator, View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Text from "./Text";
import { uiMessages } from "./messages";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message }: LoadingProps) {
  const t = useMessages(uiMessages);
  return (
    <View className="flex-1 items-center justify-center gap-3 p-6" accessibilityRole="progressbar">
      <ActivityIndicator size="large" color="#253e54" />
      <Text className="text-small text-gray-650">{message ?? t.loading}</Text>
    </View>
  );
}
