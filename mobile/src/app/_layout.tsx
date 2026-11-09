import "../../global.css";

import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/entities/user/AuthProvider";
import { makeQueryClient } from "@/shared/config/queryClient";
import { I18nProvider } from "@/shared/i18n/I18nProvider";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** 세션이 만료돼 로그인이 풀리면 로그인 화면으로 보낸다. 직접 로그아웃한 경우는 이동하지 않는다. */
function SessionGuard() {
  const router = useRouter();
  const { loading, sessionExpired, acknowledgeSessionExpired } = useAuth();

  useEffect(() => {
    if (loading || !sessionExpired) return;
    acknowledgeSessionExpired();
    router.replace({ pathname: "/login", params: { expired: "1" } });
  }, [loading, sessionExpired, acknowledgeSessionExpired, router]);

  return null;
}

function Root() {
  const { loading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Regular": require("../../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("../../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("../../assets/fonts/Pretendard-Bold.otf"),
  });
  const ready = !loading && (fontsLoaded || fontError !== null);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <SessionGuard />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(makeQueryClient);

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Root />
          </AuthProvider>
        </QueryClientProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
