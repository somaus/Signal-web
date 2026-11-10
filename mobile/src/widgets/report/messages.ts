import { defineMessages } from "@/shared/i18n/defineMessages";

// 신고서 작성 마지막 단계와 신고서 상세가 같이 쓰는 문구.
export const reportDocumentMessages = defineMessages(
  {
    summaryTitle: "사건 개요 (AI 요약)",
    summaryNotice: "AI가 요약한 내용이며 원문과 다를 수 있습니다. 제출 전에 꼭 확인해 주세요.",
    download: "신고 문서(PDF) 내려받기",
    downloading: "문서를 받는 중이에요",
    downloadFailed: "신고 문서를 내려받지 못했어요. 잠시 후 다시 시도해 주세요.",
    shareTitle: "신고 문서 열기",
    cannotOpen: "이 기기에서 PDF를 열 수 있는 앱을 찾지 못했어요.",
  },
  {
    en: {
      summaryTitle: "Case summary (AI)",
      summaryNotice:
        "This was summarized by AI and may differ from the original. Please check it before submitting.",
      download: "Download report (PDF)",
      downloading: "Downloading the document",
      downloadFailed: "Couldn't download the report. Please try again shortly.",
      shareTitle: "Open report",
      cannotOpen: "No app on this device can open the PDF.",
    },
  },
);
