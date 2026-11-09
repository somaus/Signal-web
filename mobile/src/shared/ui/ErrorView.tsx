import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "./Button";
import Text from "./Text";
import { uiMessages } from "./messages";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  const t = useMessages(uiMessages);
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Text weight="bold" className="text-body-1">
        {t.errorTitle}
      </Text>
      <Text className="text-center text-small text-gray-650">{message}</Text>
      {onRetry ? (
        <Button title={t.retry} variant="outline" onPress={onRetry} className="self-stretch" />
      ) : null}
    </View>
  );
}
