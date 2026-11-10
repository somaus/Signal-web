import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Text from "@/shared/ui/Text";
import ReportFieldList from "@/widgets/report/ReportFieldList";
import { reportMessages } from "./messages";
import { normalizeUrl } from "./reportForm";
import type { ReportForm, UploadedEvidence } from "./reportForm";

interface Step3ReviewProps {
  damageLabel: string;
  form: ReportForm;
  evidence: UploadedEvidence | null;
  /** 이미 만든 신고서를 고치는 중이면 true. 버튼 문구가 바뀐다. */
  isUpdate: boolean;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Step3Review({
  damageLabel,
  form,
  evidence,
  isUpdate,
  submitting,
  onBack,
  onSubmit,
}: Step3ReviewProps) {
  const t = useMessages(reportMessages);
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text weight="bold" className="text-body-1">
          {t.review.title}
        </Text>
        <Text className="text-small text-gray-650">{t.review.description}</Text>
      </View>

      <View className="rounded-xl bg-secondary-50 p-3">
        <Text className="text-small text-secondary-900">{t.review.aiNotice}</Text>
      </View>

      <Card>
        <ReportFieldList
          emptyText={t.review.empty}
          fields={[
            { label: t.review.damageType, value: damageLabel },
            { label: t.review.incidentDate, value: form.incidentDate },
            { label: t.review.platform, value: form.platform },
            { label: t.review.url, value: normalizeUrl(form.url) },
            { label: t.review.content, value: form.description },
            { label: t.review.extra, value: form.additionalNotes },
            { label: t.review.evidence, value: evidence?.name },
          ]}
        />
      </Card>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title={t.prev} variant="outline" disabled={submitting} onPress={onBack} />
        </View>
        <View className="flex-[2]">
          <Button
            title={
              submitting
                ? t.review.saving
                : isUpdate
                  ? t.review.updateSubmit
                  : t.review.createSubmit
            }
            loading={submitting}
            onPress={onSubmit}
          />
        </View>
      </View>
    </View>
  );
}
