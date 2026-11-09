import { Stack } from "expo-router";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { screenOptions } from "@/shared/ui/stackOptions";
import { detectTitles } from "@/views/DetectPage/titles";

export default function DetectLayout() {
  const t = useMessages(detectTitles);
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: t.result }} />
      <Stack.Screen name="history" options={{ title: t.history }} />
    </Stack>
  );
}
