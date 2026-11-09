import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useAuth } from "@/entities/user/AuthProvider";
import { ApiError } from "@/shared/api/axios";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { loginMessages } from "./messages";

export default function LoginPage() {
  const t = useMessages(loginMessages);
  const router = useRouter();
  const { expired } = useLocalSearchParams<{ expired?: string }>();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const submit = async () => {
    if (!email.trim() || !password) {
      setError(t.required);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll edges={["top", "bottom", "left", "right"]}>
      <Text weight="bold" className="text-h3">
        {t.title}
      </Text>
      {expired ? <Text className="text-small text-red-500">{t.expired}</Text> : null}
      <Input
        label={t.email}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <Input
        label={t.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={submit}
      />
      {error ? <Text className="text-small text-red-500">{error}</Text> : null}
      <View className="gap-3">
        <Button title={t.submit} onPress={submit} loading={submitting} />
        <Button title={t.guest} variant="outline" onPress={goBack} />
      </View>
    </Screen>
  );
}
