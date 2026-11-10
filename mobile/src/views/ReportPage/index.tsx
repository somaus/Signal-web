import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import type { ComponentRef } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createReport, updateReport } from "@/entities/report/api";
import { useAuth } from "@/entities/user/AuthProvider";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Text from "@/shared/ui/Text";
import { reportMessages } from "./messages";
import { emptyForm, toCreateRequest, toUpdateRequest } from "./reportForm";
import type { DamageType, ReportForm, UploadedEvidence } from "./reportForm";
import Step1TypeSelect from "./Step1TypeSelect";
import Step2Details from "./Step2Details";
import Step3Review from "./Step3Review";
import Step4Result from "./Step4Result";
import StepIndicator from "./StepIndicator";

export default function ReportPage() {
  const t = useMessages(reportMessages);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { loggedIn } = useAuth();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [step, setStep] = useState(1);
  const [damageType, setDamageType] = useState<DamageType | null>(null);
  const [form, setForm] = useState<ReportForm>(emptyForm);
  const [evidence, setEvidence] = useState<UploadedEvidence | null>(null);
  // 한 번 만든 신고서는 같은 ID로 고친다(웹과 같다).
  const [reportId, setReportId] = useState<number | null>(null);
  const damageLabel = damageType ? t.damageTypes[damageType].label : "";

  function goTo(next: number) {
    setStep(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  const save = useMutation({
    mutationFn: async () => {
      if (reportId !== null) {
        await updateReport(reportId, toUpdateRequest(damageLabel, form, evidence));
        return reportId;
      }
      const created = await createReport(toCreateRequest(damageLabel, form, evidence));
      return created.reportId;
    },
    onSuccess: async (savedId) => {
      setReportId(savedId);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      goTo(4);
    },
    onError: (error) => Alert.alert(t.review.saveFailed, error.message),
  });

  function startOver() {
    setDamageType(null);
    setForm(emptyForm);
    setEvidence(null);
    setReportId(null);
    save.reset();
    goTo(1);
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-gray-300 px-5 py-2">
        <Text weight="bold" className="text-body-1">
          {t.title}
        </Text>
        {loggedIn ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.myReports}
            onPress={() => router.push("/reports")}
            hitSlop={4}
            className="size-11 items-center justify-center"
          >
            <Ionicons name="folder-open-outline" size={24} color={colors.gray900} />
          </Pressable>
        ) : null}
      </View>

      {!loggedIn ? (
        <View className="p-5">
          <Card>
            <Text weight="semibold">{t.loginTitle}</Text>
            <Text className="text-small text-gray-650">{t.loginDescription}</Text>
            <Button title={t.login} onPress={() => router.push("/login")} />
          </Card>
        </View>
      ) : (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerClassName="gap-5 px-5 py-6"
            keyboardShouldPersistTaps="handled"
          >
            <StepIndicator step={step} />
            {step < 4 ? <Text className="text-caption text-gray-650">{t.notPerfect}</Text> : null}

            {step === 1 ? (
              <Step1TypeSelect
                damageType={damageType}
                onSelect={setDamageType}
                onNext={() => goTo(2)}
              />
            ) : null}
            {step === 2 ? (
              <Step2Details
                form={form}
                onChange={setForm}
                evidence={evidence}
                onEvidenceChange={setEvidence}
                onBack={() => goTo(1)}
                onNext={() => goTo(3)}
              />
            ) : null}
            {step === 3 ? (
              <Step3Review
                damageLabel={damageLabel}
                form={form}
                evidence={evidence}
                isUpdate={reportId !== null}
                submitting={save.isPending}
                onBack={() => goTo(2)}
                onSubmit={() => save.mutate()}
              />
            ) : null}
            {step === 4 && reportId !== null ? (
              <Step4Result reportId={reportId} onEdit={() => goTo(2)} onNewReport={startOver} />
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
