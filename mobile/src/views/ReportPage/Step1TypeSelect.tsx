import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Text from "@/shared/ui/Text";
import { reportMessages } from "./messages";
import { damageTypes } from "./reportForm";
import type { DamageType } from "./reportForm";

interface Step1TypeSelectProps {
  damageType: DamageType | null;
  onSelect: (type: DamageType) => void;
  onNext: () => void;
}

export default function Step1TypeSelect({ damageType, onSelect, onNext }: Step1TypeSelectProps) {
  const t = useMessages(reportMessages);
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text weight="bold" className="text-body-1">
          {t.step1.title}
        </Text>
        <Text className="text-small text-gray-650">{t.step1.description}</Text>
      </View>
      <View accessibilityRole="radiogroup" className="gap-2">
        {damageTypes.map((type) => {
          const selected = damageType === type;
          const { label, description } = t.damageTypes[type];
          return (
            <Pressable
              key={type}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${label}. ${description}`}
              onPress={() => onSelect(type)}
              className={cn(
                "flex-row items-center gap-3 rounded-xl border p-4",
                selected
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-300 bg-white active:bg-gray-100",
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
      <Button title={t.next} disabled={!damageType} onPress={onNext} />
    </View>
  );
}
