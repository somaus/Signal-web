import { View } from "react-native";
import { cn } from "@/shared/lib/cn";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Text from "./Text";
import { uiMessages } from "./messages";
import type { RiskLevel } from "./messages";

const containerClass: Record<RiskLevel, string> = {
  safe: "bg-green-50",
  caution: "bg-yellow-50",
  danger: "bg-red-50",
};

const textClass: Record<RiskLevel, string> = {
  safe: "text-green-500",
  caution: "text-yellow-500",
  danger: "text-red-500",
};

interface BadgeProps {
  level: RiskLevel;
}

/** 위험도 등급 표시. 웹의 RiskTag와 같은 색을 쓴다. */
export default function Badge({ level }: BadgeProps) {
  const t = useMessages(uiMessages);
  return (
    <View
      className={cn(
        "h-[25px] min-w-[45px] items-center justify-center self-start rounded-full px-2.5",
        containerClass[level],
      )}
    >
      <Text weight="bold" className={cn("text-caption", textClass[level])}>
        {t.riskLevel[level]}
      </Text>
    </View>
  );
}
