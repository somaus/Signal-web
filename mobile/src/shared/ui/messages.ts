import { defineMessages } from "@/shared/i18n/defineMessages";

export type RiskLevel = "safe" | "caution" | "danger";

export const uiMessages = defineMessages(
  {
    loading: "불러오는 중이에요",
    retry: "다시 시도",
    errorTitle: "문제가 생겼어요",
    riskLevel: { safe: "안전", caution: "주의", danger: "위험" } satisfies Record<
      RiskLevel,
      string
    >,
  },
  {
    en: {
      loading: "Loading",
      retry: "Try again",
      errorTitle: "Something went wrong",
      riskLevel: { safe: "Safe", caution: "Caution", danger: "Danger" } satisfies Record<
        RiskLevel,
        string
      >,
    },
  },
);
