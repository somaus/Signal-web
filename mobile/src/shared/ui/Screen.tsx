import { ScrollView, View } from "react-native";
import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Edge } from "react-native-safe-area-context";
import { cn } from "@/shared/lib/cn";

interface ScreenProps extends PropsWithChildren {
  /** true면 내용이 길어질 때 스크롤된다. */
  scroll?: boolean;
  /** 탭 화면은 아래쪽을 탭 바가 처리하므로 bottom을 뺀다. */
  edges?: Edge[];
  className?: string;
}

export default function Screen({
  scroll = false,
  edges = ["top", "left", "right"],
  className,
  children,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-white">
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={cn("gap-4 px-5 py-6", className)}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn("flex-1 gap-4 px-5 py-6", className)}>{children}</View>
      )}
    </SafeAreaView>
  );
}
