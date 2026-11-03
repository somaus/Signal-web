import type { DetectResult } from "./types";

export const MOCK_RESULT: DetectResult = {
  faceTheftVerdict: "도용 의심",
  faceTheftScore: 80,
  faceTheftCaption: "공개 웹에서 유사 얼굴이 감지되었습니다.",
  deepfakeVerdict: "합성 흔적 발견",
  deepfakeRiskScore: 80,
  deepfakeTone: "FAKE",
  deepfakeBand: null,
  deepfakeCaption: "얼굴 영역에서 합성 흔적이 감지되었습니다.",
  overallScore: 74,
  overallCaption: "얼굴 도용 및 딥페이크 악용 위험이 높습니다.",
  overallBand: null,
  overallWebNote: "웹 검색 결과는 반영되지 않았습니다.",
  modelConfidence: 91,
  modelConfidenceNote: "현재 입력에서 비교적 안정적으로 판단했습니다.",
  fallbackUsed: false,
  modelLabel: null,
  evidenceHighlights: [
    {
      tab: "얼굴 경계",
      description:
        "얼굴 윤곽이 배경과 부자연스럽게 분리되어 있습니다.\n합성 또는 편집 가능성이 있습니다.",
    },
    {
      tab: "프레임 간 깜빡임",
      description: "연속된 프레임에서 눈 깜빡임 패턴이 부자연스럽게 반복됩니다.",
    },
    {
      tab: "입 주변",
      description: "입 주변 움직임과 발음 형태가 음성과 일치하지 않는 구간이 있습니다.",
    },
    {
      tab: "피부 질감",
      description: "피부 질감이 주변 영역과 다르게 균일하게 보정되어 있습니다.",
    },
    {
      tab: "조명 일관성",
      description: "얼굴과 배경의 조명 방향이 서로 일치하지 않습니다.",
    },
  ],
  webMatchCount: 12,
};
