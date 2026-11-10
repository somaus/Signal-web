import { View } from "react-native";
import type { ViewProps } from "react-native";
import { cn } from "@/shared/lib/cn";

interface CardProps extends ViewProps {
  className?: string;
}

export default function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn("gap-2 rounded-xl border border-gray-300 bg-white p-4 shadow-md", className)}
      {...props}
    />
  );
}
