import { defineMessages } from "@/shared/i18n/defineMessages";

export const resultMessages = defineMessages(
  {
    processing: "AI가 사진을 분석하고 있어요",
    processingCaption: "보통 몇 초에서 1분 정도 걸려요. 화면을 벗어나도 분석은 계속돼요.",
    timeout: "분석이 오래 걸리고 있어요",
    timeoutDescription: "잠시 후 다시 확인해 주세요.",
    loadFailed: "분석 결과를 불러오지 못했어요",
    invalidId: "잘못된 분석 번호예요.",
    retryPhoto: "다른 사진으로 다시 분석",
    overallTitle: "종합 위험도",
    scoreSuffix: "점",
    meta: (id: number) => `분석 번호 #${id}`,
    factorsTitle: "상세 분석",
    recommendationsTitle: "이렇게 해 보세요",
    protect: "이 사진 보호 처리하기",
    startChat: "익명 상담 시작하기",
    again: "다른 사진 분석하기",
  },
  {
    en: {
      processing: "AI is analyzing your photo",
      processingCaption:
        "This usually takes a few seconds to a minute. The analysis continues if you leave this screen.",
      timeout: "The analysis is taking a while",
      timeoutDescription: "Please check again in a moment.",
      loadFailed: "Couldn't load the analysis result",
      invalidId: "This analysis number is invalid.",
      retryPhoto: "Analyze another photo",
      overallTitle: "Overall risk",
      scoreSuffix: "pts",
      meta: (id: number) => `Analysis #${id}`,
      factorsTitle: "Details",
      recommendationsTitle: "What you can do",
      protect: "Protect this photo",
      startChat: "Start anonymous chat",
      again: "Analyze another photo",
    },
  },
);
