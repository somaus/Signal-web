import { View } from "react-native";
import { cn } from "@/shared/lib/cn";

interface ScoreBarProps {
  /** 0~100 */
  score: number;
  className?: string;
  /** 막대 색. 기본은 primary. */
  barClassName?: string;
}

export default function ScoreBar({ score, className, barClassName }: ScoreBarProps) {
  const percent = Math.max(0, Math.min(100, score));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
    >
      <View
        className={cn("h-full rounded-full", barClassName ?? "bg-primary-600")}
        style={{ width: `${percent}%` }}
      />
    </View>
  );
}
