import { TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { cn } from "@/shared/lib/cn";
import Text from "./Text";

interface InputProps extends TextInputProps {
  label: string;
  className?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      <Text weight="medium" className="text-small text-gray-700">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#acb5bd"
        className={cn(
          "min-h-12 rounded border border-gray-500 bg-white px-4 py-2.5 font-pretendard text-body-2 text-gray-900 focus:border-primary-400",
          className,
        )}
        {...props}
      />
    </View>
  );
}
