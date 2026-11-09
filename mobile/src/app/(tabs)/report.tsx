import { useMessages } from "@/shared/i18n/I18nProvider";
import ComingSoon from "@/widgets/ComingSoon";
import { tabMessages } from "@/widgets/messages";

export default function ReportTab() {
  const t = useMessages(tabMessages);
  return <ComingSoon title={t.report} />;
}
