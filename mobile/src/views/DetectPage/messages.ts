import { defineMessages } from "@/shared/i18n/defineMessages";

export const detectMessages = defineMessages(
  {
    title: "딥페이크 탐지",
    description: "사진을 올리면 AI가 합성된 흔적이 있는지 살펴봐요.",
    start: "탐지 시작",
    uploading: "업로드 중이에요",
    failed: "탐지를 시작하지 못했어요",
    login: "로그인",
    resumeTitle: "탐지 중인 사진이 있어요",
    resumeDescription: "아직 결과가 나오지 않았어요. 이어서 확인해 볼까요?",
    resume: "이어서 보기",
    history: "탐지 기록 보기",
  },
  {
    en: {
      title: "Deepfake detection",
      description: "Upload a photo and AI checks it for signs of synthesis.",
      start: "Start detection",
      uploading: "Uploading",
      failed: "Couldn't start the detection",
      login: "Log in",
      resumeTitle: "A photo is being checked",
      resumeDescription: "The result isn't ready yet. Want to keep watching?",
      resume: "View progress",
      history: "View detection history",
    },
  },
);
