import { View } from "react-native";
import Text from "@/shared/ui/Text";

export interface ReportField {
  label: string;
  /** 비어 있으면 emptyText를 보여준다. */
  value?: string | null;
}

interface ReportFieldListProps {
  fields: ReportField[];
  emptyText: string;
}

/** 신고서 항목을 "이름 / 값" 줄로 보여준다. 작성 확인 단계와 상세 화면이 같이 쓴다. */
export default function ReportFieldList({ fields, emptyText }: ReportFieldListProps) {
  return (
    <View className="gap-3">
      {fields.map(({ label, value }) => {
        const text = value?.trim();
        return (
          <View key={label} className="gap-1 border-b border-gray-300 pb-3">
            <Text weight="semibold" className="text-small text-gray-700">
              {label}
            </Text>
            <Text className={text ? "text-small" : "text-small text-gray-600"}>
              {text || emptyText}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
