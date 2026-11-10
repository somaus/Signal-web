import { defineMessages } from "@/shared/i18n/defineMessages";

export const detectResultMessages = defineMessages(
  {
    processing: "AI가 사진을 살펴보고 있어요",
    processingCaption: "보통 몇 초에서 1분 정도 걸려요. 화면을 벗어나도 탐지는 계속돼요.",
    timeout: "탐지가 오래 걸리고 있어요. 잠시 후 다시 확인해 주세요.",
    invalidId: "잘못된 탐지 번호예요.",
    retryPhoto: "다른 사진으로 다시 탐지",
    meta: (id: number) => `탐지 번호 #${id}`,
    probability: "합성 가능성",
    percent: (value: number) => `${value}%`,
    evidenceTitle: "AI 판단 근거",
    limitTitle: "결과를 볼 때 알아두세요",
    limit:
      "이 결과는 자동 분석으로 얻은 참고용 확률이며 확정 판정이 아니에요. 사진의 진위를 보증하지 않아요. 피해가 걱정된다면 익명 상담이나 신고 문서 작성을 이용해 보세요.",
    startChat: "익명 상담하기",
    report: "신고 문서 작성하기",
    again: "다른 사진 탐지하기",
  },
  {
    en: {
      processing: "AI is checking your photo",
      processingCaption:
        "This usually takes a few seconds to a minute. The detection continues if you leave this screen.",
      timeout: "The detection is taking a while. Please check again in a moment.",
      invalidId: "This detection number is invalid.",
      retryPhoto: "Check another photo",
      meta: (id: number) => `Detection #${id}`,
      probability: "Chance of synthesis",
      percent: (value: number) => `${value}%`,
      evidenceTitle: "Why the AI thinks so",
      limitTitle: "Keep in mind",
      limit:
        "This result is a reference probability from automatic analysis, not a definitive ruling, and it doesn't guarantee whether a photo is real. If you're worried about harm, try anonymous chat or writing a report.",
      startChat: "Start anonymous chat",
      report: "Write a report",
      again: "Check another photo",
    },
  },
);
