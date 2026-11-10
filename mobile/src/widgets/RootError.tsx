import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { I18nProvider, useMessages } from "@/shared/i18n/I18nProvider";
import ErrorView from "@/shared/ui/ErrorView";
import { rootErrorMessages } from "./rootErrorMessages";

interface RootErrorProps {
  error: Error;
  onRetry: () => Promise<void>;
}

/**
 * 앱 전체 오류 화면. 루트 레이아웃의 ErrorBoundary는 레이아웃의 Provider 바깥에서 그려지므로,
 * 여기서 필요한 Provider(언어, 안전 영역)를 직접 감싼다.
 */
export default function RootError({ error, onRetry }: RootErrorProps) {
  // 앱이 준비되기 전에 오류가 나면 네이티브 스플래시가 계속 덮고 있어 이 화면이 보이지 않는다.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <SafeAreaView className="flex-1 bg-white">
          <RootErrorBody error={error} onRetry={onRetry} />
        </SafeAreaView>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

function RootErrorBody({ error, onRetry }: RootErrorProps) {
  const t = useMessages(rootErrorMessages);
  // 시연 빌드에는 일반 문구만 보이고, 개발 중에만 원인 메시지를 함께 보여 준다.
  const message = __DEV__ ? [t.message, error.message].join("\n") : t.message;
  return <ErrorView message={message} onRetry={() => void onRetry()} />;
}
