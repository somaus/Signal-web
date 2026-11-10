import { defineMessages } from "@/shared/i18n/defineMessages";

export const analyzeMessages = defineMessages(
  {
    title: "사진 위험도 분석",
    description: "SNS에 올리기 전에 사진의 위험 요소를 AI가 분석해 드려요.",
    start: "분석하기",
    uploading: "업로드 중이에요",
    failed: "분석을 시작하지 못했어요",
    login: "로그인",
    resumeTitle: "분석 중인 사진이 있어요",
    resumeDescription: "아직 결과가 나오지 않았어요. 이어서 확인해 볼까요?",
    resume: "이어서 보기",
    history: "분석 기록 보기",
  },
  {
    en: {
      title: "Photo risk analysis",
      description: "Before you post on social media, AI analyzes the risks in your photo.",
      start: "Analyze",
      uploading: "Uploading",
      failed: "Couldn't start the analysis",
      login: "Log in",
      resumeTitle: "A photo is being analyzed",
      resumeDescription: "The result isn't ready yet. Want to keep watching?",
      resume: "View progress",
      history: "View analysis history",
    },
  },
);
