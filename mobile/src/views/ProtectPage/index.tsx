import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Pressable, View } from "react-native";
import { createProtection, getProtection } from "@/entities/protection/api";
import { protectionLevels } from "@/entities/protection/model";
import type { ProtectionLevel } from "@/entities/protection/model";
import { useAuth } from "@/entities/user/AuthProvider";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import { usePollTimeout } from "@/shared/lib/usePollTimeout";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { protectMessages } from "./messages";
import {
  authHeaders,
  authorizedImageUrl,
  downloadProtectedImage,
  removeFile,
} from "./protectedImageFile";
import { saveImageToGallery } from "./saveImage";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 120_000;

interface ProtectPageProps {
  assessmentId: number;
}

function LevelPicker({
  value,
  onChange,
  disabled,
}: {
  value: ProtectionLevel;
  onChange: (level: ProtectionLevel) => void;
  disabled: boolean;
}) {
  const t = useMessages(protectMessages);
  return (
    <View accessibilityRole="radiogroup" className="gap-2">
      {protectionLevels.map((level) => {
        const selected = value === level;
        const { label, description } = t.levels[level];
        return (
          <Pressable
            key={level}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
            accessibilityLabel={`${label}. ${description}`}
            disabled={disabled}
            onPress={() => onChange(level)}
            className={cn(
              "flex-row items-center gap-3 rounded-xl border p-4",
              selected ? "border-primary-600 bg-primary-50" : "border-gray-300 bg-white",
              disabled && "opacity-60",
            )}
          >
            <Ionicons
              name={selected ? "radio-button-on" : "radio-button-off"}
              size={22}
              color={selected ? colors.primary600 : colors.gray600}
            />
            <View className="flex-1 gap-0.5">
              <Text weight="semibold">{label}</Text>
              <Text className="text-small text-gray-650">{description}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** 원본은 로그인이 필요한 서버 이미지라 인증 헤더를 붙여 불러온다. 못 불러오면 안내만 보인다. */
function OriginalPreview({ path }: { path?: string }) {
  const t = useMessages(protectMessages);
  const [headers, setHeaders] = useState<Record<string, string> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    authHeaders().then((value) => {
      if (active) setHeaders(value);
    });
    return () => {
      active = false;
    };
  }, []);

  // API와 다른 주소면 로그인 토큰을 보내지 않도록 불러오지 않고 안내만 보인다.
  const uri = path ? authorizedImageUrl(path) : null;
  if (!uri || failed) {
    return (
      <View className="h-56 items-center justify-center rounded-lg bg-gray-100 px-3">
        <Text className="text-center text-caption text-gray-650">{t.originalUnavailable}</Text>
      </View>
    );
  }
  if (!headers) return <View className="h-56 rounded-lg bg-gray-100" />;
  return (
    <Image
      source={{ uri, headers }}
      resizeMode="contain"
      accessibilityLabel={t.original}
      onError={() => setFailed(true)}
      className="h-56 w-full rounded-lg bg-gray-100"
    />
  );
}

export default function ProtectPage({ assessmentId }: ProtectPageProps) {
  const t = useMessages(protectMessages);
  const router = useRouter();
  const { loggedIn } = useAuth();
  const [level, setLevel] = useState<ProtectionLevel>("NORMAL");
  const [protectionId, setProtectionId] = useState<number | null>(null);

  const create = useMutation({
    mutationFn: () => createProtection(assessmentId, level),
    onSuccess: (created) => setProtectionId(created.protectionId),
  });

  const protection = useQuery({
    queryKey: ["protections", protectionId],
    queryFn: () => getProtection(protectionId as number),
    enabled: protectionId !== null,
    refetchInterval: (q) => (q.state.data?.status === "PROCESSING" ? POLL_INTERVAL_MS : false),
  });
  const status = protection.data?.status;
  const { timedOut, restart } = usePollTimeout(status === "PROCESSING", POLL_TIMEOUT_MS);

  // 다운로드 중에 화면을 떠나도 요청은 끝까지 갈 수 있어서, 그때 받은 파일은 바로 지운다.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const image = useQuery({
    queryKey: ["protections", protectionId, "file"],
    queryFn: async () => {
      const downloaded = await downloadProtectedImage(protectionId as number);
      if (!mountedRef.current) removeFile(downloaded);
      return downloaded;
    },
    enabled: status === "COMPLETED",
    staleTime: Infinity,
    gcTime: 0,
    retry: false,
  });
  const file = image.data;

  // 보호된 이미지는 사진 원본이 들어 있는 민감한 파일이라 화면을 떠나면 캐시에서 지운다.
  useEffect(() => {
    if (!file) return;
    return () => removeFile(file);
  }, [file]);

  const save = useMutation({
    mutationFn: async () => saveImageToGallery((file as NonNullable<typeof file>).uri),
    onSuccess: (result) => {
      if (result === "saved") {
        Alert.alert(t.saved);
        return;
      }
      // 권한을 거부해도 앱이 멈추지 않고 설정 안내와 공유 대안을 보여준다.
      Alert.alert(t.permissionTitle, t.permissionDescription, [
        { text: t.close, style: "cancel" },
        { text: t.openSettings, onPress: () => void Linking.openSettings() },
      ]);
    },
    onError: () => Alert.alert(t.saveFailed),
  });

  async function share() {
    if (!file) return;
    try {
      if (!(await Sharing.isAvailableAsync())) throw new Error("sharing unavailable");
      await Sharing.shareAsync(file.uri, { mimeType: "image/png", UTI: "public.png" });
    } catch {
      Alert.alert(t.shareFailed);
    }
  }

  function reset() {
    create.reset();
    setProtectionId(null);
  }

  if (!loggedIn) {
    return (
      <Screen edges={["left", "right"]}>
        <Card>
          <Text weight="semibold">{t.loginTitle}</Text>
          <Text className="text-small text-gray-650">{t.loginDescription}</Text>
          <Button title={t.login} onPress={() => router.push("/login")} />
        </Card>
      </Screen>
    );
  }

  let body;
  if (protectionId === null) {
    body = (
      <>
        <Text weight="bold" className="text-body-1">
          {t.levelTitle}
        </Text>
        <LevelPicker value={level} onChange={setLevel} disabled={create.isPending} />
        {create.isError ? (
          <Text accessibilityRole="alert" className="text-small text-red-500">
            {`${t.failed} ${create.error.message}`}
          </Text>
        ) : null}
        <Button
          title={create.isPending ? t.starting : t.start}
          loading={create.isPending}
          onPress={() => create.mutate()}
        />
      </>
    );
  } else if (protection.isError && !protection.data) {
    body = <ErrorView message={protection.error.message} onRetry={() => protection.refetch()} />;
  } else if (timedOut) {
    body = (
      <ErrorView
        message={t.timeout}
        onRetry={() => {
          restart();
          void protection.refetch();
        }}
      />
    );
  } else if (!status || status === "PROCESSING") {
    body = (
      <View className="items-center gap-2 py-10" accessibilityLiveRegion="polite">
        <ActivityIndicator size="large" color={colors.primary600} />
        <Text weight="semibold">{t.processing}</Text>
        <Text className="text-small text-gray-650">{t.processingCaption}</Text>
      </View>
    );
  } else if (status === "FAILED") {
    body = <ErrorView message={t.failed} onRetry={reset} />;
  } else if (image.isError) {
    body = <ErrorView message={t.downloadFailed} onRetry={() => image.refetch()} />;
  } else if (!file) {
    body = (
      <View className="items-center gap-2 py-10">
        <ActivityIndicator size="large" color={colors.primary600} />
        <Text className="text-small text-gray-650">{t.downloading}</Text>
      </View>
    );
  } else {
    const simulated = protection.data?.simulated === true;
    body = (
      <>
        <Text weight="bold" className="text-body-1">
          {t.compareTitle}
        </Text>
        <View className="flex-row gap-2">
          <View className="flex-1 gap-1">
            <Text className="text-center text-small text-gray-650">{t.original}</Text>
            <OriginalPreview path={protection.data?.originalImageUrl} />
          </View>
          <View className="flex-1 gap-1">
            <Text weight="semibold" className="text-center text-small text-primary-600">
              {t.protected}
            </Text>
            <Image
              source={{ uri: file.uri }}
              resizeMode="contain"
              accessibilityLabel={t.protected}
              className="h-56 w-full rounded-lg bg-gray-100"
            />
          </View>
        </View>
        <Card className={simulated ? "border-yellow-500 bg-yellow-50" : undefined}>
          <Text className="text-small text-gray-800">{simulated ? t.simulated : t.applied}</Text>
        </Card>
        <Button
          title={save.isPending ? t.saving : t.save}
          loading={save.isPending}
          onPress={() => save.mutate()}
        />
        <Button title={t.share} variant="outline" onPress={() => void share()} />
        <Button title={t.again} variant="outline" onPress={reset} />
      </>
    );
  }

  return (
    <Screen scroll edges={["left", "right"]}>
      <Text className="text-small text-gray-650">{t.intro}</Text>
      <Card className="border-secondary-200 bg-secondary-50">
        <Text className="text-small text-gray-800">{t.limit}</Text>
      </Card>
      {body}
    </Screen>
  );
}
