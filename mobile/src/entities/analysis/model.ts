import { defineMessages } from "@/shared/i18n/defineMessages";
import type { RiskLevel as BadgeLevel } from "@/shared/ui/messages";
import type { AssessmentFailureReason, RiskFactorResponse, RiskLevel } from "./api";

export const RECENT_ASSESSMENTS_KEY = "recentAssessmentIds";

export const badgeLevel: Record<RiskLevel, BadgeLevel> = {
  HIGH: "danger",
  MEDIUM: "caution",
  LOW: "safe",
};

/** 위험도 점수가 높을수록 위험하므로 색도 점수 구간이 아니라 서버가 정한 등급을 따른다. */
export const levelBarClass: Record<RiskLevel, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500",
};

export const levelTextClass: Record<RiskLevel, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-yellow-500",
  LOW: "text-green-500",
};

export const assessmentMessages = defineMessages(
  {
    levelDescription: {
      HIGH: "AI 악용 위험이 높아요.\n이미지 보호 처리 후 올리는 것을 권해요.",
      MEDIUM: "AI 악용 위험이 있어요.\n이미지 보호 처리를 고려해 보세요.",
      LOW: "AI 악용 위험이 낮아요.",
    } satisfies Record<RiskLevel, string>,
    fallbackNote:
      "AI 모델 응답에 실패해 이번 결과는 참고용 추정치예요. 실제 이미지 분석 결과가 아닐 수 있어요.",
    failure: {
      NO_FACE_DETECTED: {
        title: "얼굴을 찾을 수 없어요",
        description: "얼굴이 선명하게 보이는 사진으로 다시 올려 주세요.",
      },
      INVALID_IMAGE: {
        title: "이 사진은 분석할 수 없어요",
        description:
          "사진을 읽을 수 없거나 해상도와 용량이 너무 커요. 다른 사진으로 시도해 주세요.",
      },
      AI_SERVER_ERROR: {
        title: "AI 분석 서버에 일시적인 문제가 있어요",
        description: "잠시 후 다시 시도해 주세요.",
      },
      TIMEOUT: {
        title: "분석 시간이 초과됐어요",
        description: "잠시 후 다시 시도해 주세요.",
      },
    } satisfies Record<AssessmentFailureReason, { title: string; description: string }>,
    unknownFailure: {
      title: "분석에 실패했어요",
      description: "잠시 후 다시 시도해 주세요.",
    },
    factorLabels: {
      IMAGE_QUALITY: "이미지 품질",
      FACE_EXPOSURE: "얼굴 노출도",
      METADATA_LEAK: "메타데이터 노출",
      REVERSE_SEARCH_RISK: "역검색 노출 위험",
    } as Record<string, string>,
  },
  {
    en: {
      levelDescription: {
        HIGH: "High risk of AI misuse.\nWe recommend protecting the image before posting.",
        MEDIUM: "Some risk of AI misuse.\nConsider protecting the image.",
        LOW: "Low risk of AI misuse.",
      },
      fallbackNote:
        "The AI model didn't respond, so this is a reference estimate and may not reflect an actual image analysis.",
      failure: {
        NO_FACE_DETECTED: {
          title: "We couldn't find a face",
          description: "Please upload a photo where the face is clearly visible.",
        },
        INVALID_IMAGE: {
          title: "This photo can't be analyzed",
          description:
            "The photo can't be read, or its resolution or size is too large. Please try another photo.",
        },
        AI_SERVER_ERROR: {
          title: "The AI analysis server is having a temporary problem",
          description: "Please try again in a moment.",
        },
        TIMEOUT: {
          title: "The analysis timed out",
          description: "Please try again in a moment.",
        },
      },
      unknownFailure: {
        title: "The analysis failed",
        description: "Please try again in a moment.",
      },
      factorLabels: {
        IMAGE_QUALITY: "Image quality",
        FACE_EXPOSURE: "Face exposure",
        METADATA_LEAK: "Metadata exposure",
        REVERSE_SEARCH_RISK: "Reverse search exposure risk",
      },
    },
  },
);

/** 서버가 준 항목 이름보다 앱에서 번역한 이름을 먼저 쓴다. 모르는 항목은 서버 이름을 그대로 쓴다. */
export function factorLabel(
  factor: Pick<RiskFactorResponse, "type" | "label">,
  labels: Record<string, string>,
): string {
  return labels[factor.type] ?? factor.label;
}
