import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { getMyProfile } from "@/entities/user/api";
import { useAuth } from "@/entities/user/AuthProvider";
import { API_URL } from "@/shared/config/env";
import { locales, localeNames } from "@/shared/i18n/config";
import { useLocale, useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { moreMessages } from "./messages";

export default function MorePage() {
  const t = useMessages(moreMessages);
  const router = useRouter();
  const { loggedIn, logout } = useAuth();
  const { locale, setLocale } = useLocale();
  const profile = useQuery({
    queryKey: ["users", "me"],
    queryFn: getMyProfile,
    enabled: loggedIn,
  });

  return (
    <Screen scroll>
      <Text weight="bold" className="text-h3">
        {t.title}
      </Text>

      <Card>
        <Text weight="semibold">{t.account}</Text>
        {loggedIn ? (
          <>
            <Text className="text-small text-gray-650">
              {profile.data
                ? `${profile.data.name} (${profile.data.email})`
                : profile.isError
                  ? t.profileError
                  : ""}
            </Text>
            <Button title={t.logout} variant="outline" onPress={logout} />
          </>
        ) : (
          <>
            <Text className="text-small text-gray-650">{t.guest}</Text>
            <Button title={t.login} onPress={() => router.push("/login")} />
          </>
        )}
      </Card>

      <Card>
        <Text weight="semibold">{t.language}</Text>
        <View className="flex-row gap-2">
          {locales.map((code) => (
            <Pressable
              key={code}
              accessibilityRole="button"
              accessibilityState={{ selected: locale === code }}
              onPress={() => setLocale(code)}
              className={cn(
                "min-h-10 flex-1 items-center justify-center rounded border",
                locale === code ? "border-primary-600 bg-primary-50" : "border-gray-500 bg-white",
              )}
            >
              <Text weight={locale === code ? "semibold" : "regular"} className="text-small">
                {localeNames[code]}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <Text weight="semibold">{t.server}</Text>
        <Text className="text-caption text-gray-650">{API_URL}</Text>
      </Card>
    </Screen>
  );
}
