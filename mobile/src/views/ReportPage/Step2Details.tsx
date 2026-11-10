import { useState } from "react";
import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Text from "@/shared/ui/Text";
import EvidencePicker from "./EvidencePicker";
import { reportMessages } from "./messages";
import { validateForm } from "./reportForm";
import type { ReportForm, UploadedEvidence } from "./reportForm";

interface Step2DetailsProps {
  form: ReportForm;
  onChange: (form: ReportForm) => void;
  evidence: UploadedEvidence | null;
  onEvidenceChange: (evidence: UploadedEvidence | null) => void;
  onBack: () => void;
  onNext: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" className="text-caption text-red-600">
      {message}
    </Text>
  );
}

export default function Step2Details({
  form,
  onChange,
  evidence,
  onEvidenceChange,
  onBack,
  onNext,
}: Step2DetailsProps) {
  const t = useMessages(reportMessages);
  // 처음부터 빨간 안내를 띄우지 않고, "내용 확인하기"를 누른 뒤부터 보여준다.
  const [showErrors, setShowErrors] = useState(false);
  const errors = showErrors ? validateForm(form, t.step2) : {};

  function update(key: keyof ReportForm) {
    return (value: string) => onChange({ ...form, [key]: value });
  }

  function submit() {
    setShowErrors(true);
    if (Object.keys(validateForm(form, t.step2)).length === 0) onNext();
  }

  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text weight="bold" className="text-body-1">
          {t.step2.title}
        </Text>
        <Text className="text-small text-gray-650">{t.step2.description}</Text>
      </View>

      <View className="gap-1">
        <Input
          label={t.step2.incidentDate}
          placeholder={t.step2.incidentDatePlaceholder}
          value={form.incidentDate}
          onChangeText={update("incidentDate")}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        <FieldError message={errors.incidentDate} />
      </View>

      <Input
        label={t.step2.platform}
        placeholder={t.step2.platformPlaceholder}
        value={form.platform}
        onChangeText={update("platform")}
        maxLength={100}
      />

      <View className="gap-1">
        <Input
          label={t.step2.url}
          placeholder={t.step2.urlPlaceholder}
          value={form.url}
          onChangeText={update("url")}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FieldError message={errors.url} />
      </View>

      <View className="gap-1">
        <Input
          label={t.step2.whatHappened}
          placeholder={t.step2.whatHappenedPlaceholder}
          value={form.description}
          onChangeText={update("description")}
          multiline
          textAlignVertical="top"
          maxLength={5000}
          className="min-h-32"
        />
        <Text className="text-caption text-gray-650">{t.step2.whatHappenedHint}</Text>
        <FieldError message={errors.description} />
      </View>

      <Input
        label={t.step2.extra}
        placeholder={t.step2.extraPlaceholder}
        value={form.additionalNotes}
        onChangeText={update("additionalNotes")}
        multiline
        textAlignVertical="top"
        maxLength={2000}
        className="min-h-24"
      />

      <EvidencePicker evidence={evidence} onChange={onEvidenceChange} />

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title={t.prev} variant="outline" onPress={onBack} />
        </View>
        <View className="flex-[2]">
          <Button title={t.step2.toReview} onPress={submit} />
        </View>
      </View>
    </View>
  );
}
