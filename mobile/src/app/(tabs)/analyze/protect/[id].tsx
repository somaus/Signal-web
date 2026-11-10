import { useLocalSearchParams } from "expo-router";
import { useMessages } from "@/shared/i18n/I18nProvider";
import ErrorView from "@/shared/ui/ErrorView";
import Screen from "@/shared/ui/Screen";
import ProtectPage from "@/views/ProtectPage";
import { protectMessages } from "@/views/ProtectPage/messages";

/** /analyze/protect/[분석 번호]. 분석이 끝난 사진에 보호 처리를 한다. */
export default function ProtectRoute() {
  const t = useMessages(protectMessages);
  const { id } = useLocalSearchParams<{ id: string }>();
  const assessmentId = Number(id);
  if (!Number.isInteger(assessmentId) || assessmentId <= 0) {
    return (
      <Screen edges={["left", "right"]}>
        <ErrorView message={t.invalidId} />
      </Screen>
    );
  }
  return <ProtectPage assessmentId={assessmentId} />;
}
