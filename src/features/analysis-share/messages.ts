import { defineMessages } from "@/shared/i18n/defineMessages";

export const analysisShareMessages = defineMessages(
  {
    heading: "[Signal 사진 위험도 분석 결과]",
    risk: (level: string, score: number) => `위험도: ${level} (${score}%)`,
    topFactors: "주요 위험 요인",
    title: "Signal 분석 결과",
    failed: "공유하지 못했습니다.",
    copied: "분석 결과 요약을 복사했어요.",
    copyFailed: "결과를 복사하지 못했습니다.",
  },
  {
    en: {
      heading: "[Signal photo risk analysis]",
      risk: (level, score) => `Risk: ${level} (${score}%)`,
      topFactors: "Top risk factors",
      title: "Signal analysis result",
      failed: "Couldn't share.",
      copied: "Result summary copied.",
      copyFailed: "Couldn't copy the result.",
    },
    ja: {
      heading: "[Signal 写真の危険度分析結果]",
      risk: (level, score) => `危険度：${level}（${score}%）`,
      topFactors: "主な危険要因",
      title: "Signal 分析結果",
      failed: "共有できませんでした。",
      copied: "分析結果の要約をコピーしました。",
      copyFailed: "結果をコピーできませんでした。",
    },
    zh: {
      heading: "[Signal 照片风险分析结果]",
      risk: (level, score) => `风险：${level}（${score}%）`,
      topFactors: "主要风险因素",
      title: "Signal 分析结果",
      failed: "分享失败。",
      copied: "已复制分析结果摘要。",
      copyFailed: "复制结果失败。",
    },
  },
);
