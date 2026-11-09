import { defineMessages } from "@/shared/i18n/defineMessages";

export const reportDocumentMessages = defineMessages(
  {
    download: "신고 문서(PDF) 내려받기",
    downloading: "문서 만드는 중...",
    downloadFailed: "신고 문서를 내려받지 못했어요. 잠시 후 다시 시도해 주세요.",
    summaryTitle: "사건 개요 (AI 요약)",
    summaryNotice:
      "AI가 입력하신 피해 내용을 요약한 것으로 원문과 다를 수 있어요. 제출 전에 꼭 확인해 주세요.",
  },
  {
    en: {
      download: "Download report (PDF)",
      downloading: "Preparing the file...",
      downloadFailed: "Couldn't download the report. Please try again in a moment.",
      summaryTitle: "Case summary (AI)",
      summaryNotice:
        "AI summarized what you wrote and it may differ from the original. Please check it before submitting.",
    },
    ja: {
      download: "通報書類（PDF）をダウンロード",
      downloading: "ファイルを作成中...",
      downloadFailed:
        "通報書類をダウンロードできませんでした。しばらくしてからもう一度お試しください。",
      summaryTitle: "事件の概要（AI要約）",
      summaryNotice:
        "入力された被害内容をAIが要約したもので、原文と異なる場合があります。提出前に必ずご確認ください。",
    },
    zh: {
      download: "下载举报文件（PDF）",
      downloading: "正在生成文件...",
      downloadFailed: "无法下载举报文件。请稍后再试。",
      summaryTitle: "事件概要（AI摘要）",
      summaryNotice: "这是AI对你填写的伤害内容的摘要，可能与原文不同。提交前请务必确认。",
    },
  },
);
