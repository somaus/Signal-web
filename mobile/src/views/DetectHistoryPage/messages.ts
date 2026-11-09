import { defineMessages } from "@/shared/i18n/defineMessages";

export const detectHistoryMessages = defineMessages(
  {
    note: "서버에 탐지 기록 목록이 없어서, 이 기기에서 탐지한 최근 기록만 보여요.",
    empty: "아직 탐지한 사진이 없어요.",
    item: (id: number) => `탐지 #${id}`,
    processing: "탐지 중",
    failed: "탐지 실패",
  },
  {
    en: {
      note: "The server has no detection history list, so only recent detections from this device are shown.",
      empty: "You haven't checked any photos yet.",
      item: (id: number) => `Detection #${id}`,
      processing: "Checking",
      failed: "Failed",
    },
  },
);
