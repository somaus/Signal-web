import "../../global.css";

import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/entities/user/AuthProvider";
import { makeQueryClient } from "@/shared/config/queryClient";
import { I18nProvider } from "@/shared/i18n/I18nProvider";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** 로그인돼 있던 중에 토큰이 지워지면(만료·로그아웃) 로그인 화면으로 보낸다. */
function SessionGuard() {
  const router = useRouter();
  const { loading, loggedIn } = useAuth();
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (wasLoggedIn.current && !loggedIn) {
      router.replace({ pathname: "/login", params: { expired: "1" } });
    }
    wasLoggedIn.current = loggedIn;
  }, [loading, loggedIn, router]);

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
