import { useQuery } from "@tanstack/react-query";
import { Alert, Linking, View } from "react-native";
import { createConnection, getAgencies } from "@/entities/agency/api";
import type { AgencyResponse, ConnectionType, SituationType } from "@/entities/agency/model";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import ErrorView from "@/shared/ui/ErrorView";
import Loading from "@/shared/ui/Loading";
import Text from "@/shared/ui/Text";
import { dialNumber } from "@/widgets/chat/chatMarkdown";
import { callPhone } from "@/widgets/chat/ChatRichText";
import { chatMessages } from "./messages";
import SheetModal from "./SheetModal";

export interface AgencySheetState {
  /** 비우면 모든 기관을 보여준다. */
  situationType?: SituationType;
}

interface AgencySheetProps {
  state: AgencySheetState | null;
  onClose: () => void;
}

/** 어떤 상황에서도 바로 걸 수 있는 긴급 전화. 기관 목록을 못 불러와도 보이도록 코드에 둔다. */
const EMERGENCY_NUMBERS = [
  { key: "police", number: "112" },
  { key: "emergency", number: "119" },
  { key: "suicide", number: "109" },
] as const;

/** 연결 기록은 통계용이라, 실패해도 전화·웹 열기는 막지 않는다. */
function recordConnection(agencyId: number, connectionType: ConnectionType) {
  createConnection(agencyId, { connectionType }).catch(() => undefined);
}

function AgencyItem({ agency }: { agency: AgencyResponse }) {
  const t = useMessages(chatMessages);
  const digits = agency.phone ? dialNumber(agency.phone) : null;

  function openWebsite(url: string) {
    recordConnection(agency.agencyId, "WEB");
    Linking.openURL(url).catch(() => Alert.alert(t.agency.openFailed));
  }

  return (
    <Card>
      <Text weight="bold">{agency.name}</Text>
      {agency.availableHours ? (
        <Text className="text-small text-gray-650">{`${t.agency.hours}: ${agency.availableHours}`}</Text>
      ) : null}
      {agency.supportedActions?.length ? (
        <Text className="text-small text-gray-650">{agency.supportedActions.join(" · ")}</Text>
      ) : null}
      {digits || agency.website ? (
        <View className="mt-2 flex-row gap-2">
          {digits ? (
            <Button
              title={`${t.agency.callButton} ${agency.phone}`}
              accessibilityLabel={t.agency.call(agency.name)}
              onPress={() => {
                recordConnection(agency.agencyId, "PHONE");
                callPhone(digits, t.agency.openFailed);
              }}
              className="flex-1"
            />
          ) : null}
          {agency.website ? (
            <Button
              title={t.agency.website}
              variant="outline"
              onPress={() => openWebsite(agency.website as string)}
              className={digits ? undefined : "flex-1"}
            />
          ) : null}
        </View>
      ) : (
        <Text className="text-small text-gray-650">{t.agency.noContact}</Text>
      )}
    </Card>
  );
}

/** 긴급 전화와 상담 기관 목록을 보여주고, 누르면 바로 전화를 건다. */
export default function AgencySheet({ state, onClose }: AgencySheetProps) {
  const t = useMessages(chatMessages);
  const visible = state !== null;
  const situationType = state?.situationType;
  const isCrisis = situationType === "CRISIS";

  const agencies = useQuery({
    queryKey: ["agencies", situationType ?? "all"],
    queryFn: () => getAgencies(situationType),
    enabled: visible,
  });

  return (
    <SheetModal
      visible={visible}
      title={isCrisis ? t.crisis.title : t.agency.title}
      onClose={onClose}
    >
      {isCrisis ? <Text className="text-small text-gray-700">{t.crisis.guide}</Text> : null}

      <View className="gap-2">
        {EMERGENCY_NUMBERS.map(({ key, number }) => (
          <Button
            key={key}
            title={t.crisis[key]}
            accessibilityLabel={`${t.crisis[key]}`}
            onPress={() => callPhone(number, t.agency.openFailed)}
          />
        ))}
      </View>

      {agencies.isPending ? (
        <View className="h-40">
          <Loading message={t.agency.loading} />
        </View>
      ) : agencies.isError ? (
        <View className="h-48">
          <ErrorView message={t.agency.failed} onRetry={() => agencies.refetch()} />
        </View>
      ) : agencies.data.length === 0 ? (
        <Text className="text-small text-gray-650">{t.agency.empty}</Text>
      ) : (
        agencies.data.map((agency) => <AgencyItem key={agency.agencyId} agency={agency} />)
      )}
    </SheetModal>
  );
}
