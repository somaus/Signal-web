import { Stack } from "expo-router";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { screenOptions } from "@/shared/ui/stackOptions";
import { analyzeTitles } from "@/views/AnalyzePage/titles";

export default function AnalyzeLayout() {
  const t = useMessages(analyzeTitles);
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: t.result }} />
      <Stack.Screen name="history" options={{ title: t.history }} />
      <Stack.Screen name="protect/[id]" options={{ title: t.protect }} />
    </Stack>
  );
}
