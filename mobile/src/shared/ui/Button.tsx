import { ActivityIndicator, Pressable } from "react-native";
import type { PressableProps } from "react-native";
import { cn } from "@/shared/lib/cn";
import Text from "./Text";

export type ButtonVariant = "primary" | "outline";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

const containerClass: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 active:bg-primary-900",
  outline: "border border-gray-700 bg-white active:border-gray-900 active:bg-gray-100",
};

const textClass: Record<ButtonVariant, string> = {
  primary: "text-white",
  outline: "text-gray-900",
};

export default function Button({
  title,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      className={cn(
        "min-h-12 flex-row items-center justify-center gap-2 rounded px-4 py-2.5",
        inactive ? "border-0 bg-gray-200" : containerClass[variant],
        className,
      )}
      {...props}
    >
      {loading ? <ActivityIndicator color="#acb5bd" /> : null}
      <Text
        weight="semibold"
        className={cn("text-large", inactive ? "text-gray-600" : textClass[variant])}
      >
        {title}
      </Text>
    </Pressable>
  );
}
