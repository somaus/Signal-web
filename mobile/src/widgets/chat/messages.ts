import { defineMessages } from "@/shared/i18n/defineMessages";

export const chatBubbleMessages = defineMessages(
  {
    call: (number: string) => `${number}로 전화 걸기`,
    callFailed: "전화를 걸 수 없어요. 기기에서 전화 기능을 사용할 수 있는지 확인해 주세요.",
    referral: "전문 기관 연결하기",
    writeReport: "신고 문서 작성하기",
    sendFailed: "메시지 전송에 실패했습니다.",
    retry: "다시 보내기",
    sending: "전송 중",
    counselor: "AI 상담사",
  },
  {
    en: {
      call: (number) => `Call ${number}`,
      callFailed: "Couldn't place the call. Please check that your device can make calls.",
      referral: "Connect with an agency",
      writeReport: "Write a report",
      sendFailed: "Couldn't send your message.",
      retry: "Resend",
      sending: "Sending",
      counselor: "AI counselor",
    },
  },
);
