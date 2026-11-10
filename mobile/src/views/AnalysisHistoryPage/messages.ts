import { defineMessages } from "@/shared/i18n/defineMessages";

export const historyMessages = defineMessages(
  {
    empty: "아직 분석한 사진이 없어요.",
    guestNote: "로그인하지 않으면 이 기기에서 분석한 최근 기록만 보여요.",
    item: (id: number) => `분석 #${id}`,
    score: (score: number) => `${score}점`,
    processing: "분석 중",
    failed: "분석 실패",
    noFace: "얼굴을 찾지 못함",
    loadFailed: "기록을 불러오지 못했어요.",
  },
  {
    en: {
      empty: "You haven't analyzed any photos yet.",
      guestNote: "When you're not logged in, only recent analyses from this device are shown.",
      item: (id: number) => `Analysis #${id}`,
      score: (score: number) => `${score} pts`,
      processing: "Analyzing",
      failed: "Failed",
      noFace: "No face found",
      loadFailed: "Couldn't load your history.",
    },
  },
);
