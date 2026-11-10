import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import Text from "@/shared/ui/Text";
import { reportMessages } from "./messages";

/** 지금 몇 단계인지 보여주는 막대. 화면 읽기 프로그램에는 "4단계 중 2단계: 상황 입력"으로 읽힌다. */
export default function StepIndicator({ step }: { step: number }) {
  const t = useMessages(reportMessages);
  const total = t.steps.length;
  return (
    <View
      className="gap-2"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t.stepLabel(step, total, t.steps[step - 1])}
      accessibilityValue={{ min: 1, max: total, now: step }}
    >
      <View className="flex-row gap-1.5">
        {t.steps.map((name, index) => (
          <View
            key={name}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index < step ? "bg-primary-600" : "bg-gray-300",
            )}
          />
        ))}
      </View>
      <Text weight="semibold" className="text-small text-primary-600">
        {`${step}/${total} · ${t.steps[step - 1]}`}
      </Text>
    </View>
  );
}
