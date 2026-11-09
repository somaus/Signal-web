import { View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Card from "@/shared/ui/Card";
import Screen from "@/shared/ui/Screen";
import Text from "@/shared/ui/Text";
import { tabMessages } from "./messages";

interface ComingSoonProps {
  title: string;
}

/** 아직 화면이 없는 탭에 보여주는 자리 표시용 화면. 각 화면 이슈에서 교체한다. */
export default function ComingSoon({ title }: ComingSoonProps) {
  const t = useMessages(tabMessages);
  return (
    <Screen>
      <Text weight="bold" className="text-h3">
        {title}
      </Text>
      <View>
        <Card>
          <Text className="text-gray-650">{t.comingSoon}</Text>
        </Card>
      </View>
    </Screen>
  );
}
