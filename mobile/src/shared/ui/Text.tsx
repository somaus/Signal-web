import { Text as RNText } from "react-native";
import type { TextProps as RNTextProps } from "react-native";
import { cn } from "@/shared/lib/cn";

export type TextWeight = "regular" | "medium" | "semibold" | "bold";

const weightClass: Record<TextWeight, string> = {
  regular: "font-pretendard",
  medium: "font-pretendard-medium",
  semibold: "font-pretendard-semibold",
  bold: "font-pretendard-bold",
};

interface TextProps extends RNTextProps {
  weight?: TextWeight;
  className?: string;
}

/** Pretendard가 기본 적용되는 Text. 굵기는 className이 아니라 weight로 고른다. */
export default function Text({ weight = "regular", className, ...props }: TextProps) {
  return (
    <RNText
      className={cn(weightClass[weight], "text-body-2 text-gray-900", className)}
      {...props}
    />
  );
}
