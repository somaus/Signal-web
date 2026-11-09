import { defineMessages } from "@/shared/i18n/defineMessages";
import { isDeepfakeBand } from "./api";
import type {
  DeepfakeBand,
  DeepfakeDetectionResponse,
  DeepfakeVerdict,
  DetectionFailureReason,
} from "./api";

export const RECENT_DETECTIONS_KEY = "recentDetectionIds";

export const bandStyle: Record<DeepfakeBand, { bg: string; text: string; bar: string }> = {
  HIGH: { bg: "bg-red-50", text: "text-red-500", bar: "bg-red-500" },
  UNCERTAIN: { bg: "bg-yellow-50", text: "text-yellow-500", bar: "bg-yellow-500" },
  LOW: { bg: "bg-green-50", text: "text-green-500", bar: "bg-green-500" },
  UNDETERMINED: { bg: "bg-gray-100", text: "text-gray-650", bar: "bg-gray-300" },
};

const verdictBand: Record<DeepfakeVerdict, DeepfakeBand> = {
  REAL: "LOW",
  SUSPICIOUS: "UNCERTAIN",
  FAKE: "HIGH",
};

function scoreBand(score: number): DeepfakeBand {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "UNCERTAIN";
  return "LOW";
}

/**
 * 서버가 준 등급(band)을 쓰고, 이전 기록처럼 등급이 없으면 판정(verdict)이나 점수로 같은 등급을 만든다.
 * 둘 다 없으면 판단 불가로 본다.
 */
export function resolveBand(data: DeepfakeDetectionResponse): DeepfakeBand {
  if (isDeepfakeBand(data.band)) return data.band;
  if (data.verdict) return verdictBand[data.verdict];
  if (data.riskScore != null) return scoreBand(data.riskScore);
  return "UNDETERMINED";
}

interface FailureText {
  title: string;
  description: string;
}

export const detectionMessages = defineMessages(
  {
    band: {
      LOW: "합성 흔적을 찾지 못함",
      UNCERTAIN: "합성 가능성 불확실",
      HIGH: "합성 가능성 높음",
      UNDETERMINED: "판단할 수 없음",
    } satisfies Record<DeepfakeBand, string>,
    bandLevel: {
      LOW: "낮음",
      UNCERTAIN: "불확실",
      HIGH: "높음",
      UNDETERMINED: "-",
    } satisfies Record<DeepfakeBand, string>,
    bandCaption: {
      LOW: "합성 흔적을 찾지 못했어요. 다만 진짜임을 보증하지는 않아요.",
      UNCERTAIN: "판단이 어려워요. 합성 가능성이 불확실하니 아래 안내를 참고해 주세요.",
      HIGH: "합성 가능성이 높아요.",
      UNDETERMINED: "이 사진은 판단할 수 없어요. 다른 사진으로 다시 시도해 주세요.",
    } satisfies Record<DeepfakeBand, string>,
    provenanceCaption: {
      HIGH: "이미지 파일에 AI 생성 도구의 기록이 남아 있어요.",
      UNCERTAIN: "이미지 파일에 일부를 AI로 편집했다는 표시가 있어요.",
    } as Partial<Record<DeepfakeBand, string>>,
    undeterminedReason: {
      LOW_RESOLUTION:
        "이미지가 너무 작아 정확한 분석이 어려워요. 원본 사진으로 다시 시도해 주세요.",
      NO_FACE_DETECTED:
        "사진에서 얼굴을 찾지 못해 판단할 수 없어요. 얼굴이 잘 보이는 사진으로 다시 시도해 주세요.",
    } as Record<string, string>,
    failure: {
      NO_FACE_DETECTED: {
        title: "사진에서 얼굴을 찾지 못했어요",
        description: "얼굴이 정면으로 잘 보이는 사진으로 다시 시도해 주세요.",
      },
      VIDEO_NOT_SUPPORTED: {
        title: "영상 탐지는 아직 지원하지 않아요",
        description: "영상 속 얼굴이 잘 보이는 장면을 캡처한 사진으로 시도해 주세요.",
      },
      AI_SERVER_ERROR: {
        title: "AI 분석 서버에 일시적인 문제가 있어요",
        description: "잠시 후 다시 시도해 주세요.",
      },
      TIMEOUT: { title: "분석 시간이 초과됐어요", description: "잠시 후 다시 시도해 주세요." },
    } satisfies Record<DetectionFailureReason, FailureText>,
    unknownFailure: { title: "탐지에 실패했어요", description: "잠시 후 다시 시도해 주세요." },
    evidenceType: {
      BLINK_PATTERN_ANOMALY: "눈 깜빡임 패턴",
      COMPRESSION_ARTIFACT: "압축 아티팩트",
      FACE_BOUNDARY: "얼굴 경계",
      LIGHTING_INCONSISTENCY: "조명 일관성",
      SKIN_TEXTURE: "피부 질감",
      MOUTH_SYNC: "입 주변 움직임",
    } as Record<string, string>,
    provenance: {
      GENERATOR_METADATA: "이미지 파일에 AI 생성 도구로 만들었다는 기록이 남아 있어요.",
      AI_SOURCE_DECLARED: "이미지 파일에 AI로 생성한 콘텐츠라는 표시가 있어요.",
      AI_EDIT_DECLARED:
        "이미지 파일에 일부를 AI로 편집·합성했다는 표시가 있어요. 이미지 전체를 AI로 만들었다는 뜻은 아니에요.",
      C2PA_MANIFEST:
        "이미지 파일에 콘텐츠 자격 증명(C2PA)이 들어 있어요. 서명은 검증하지 않았으며 참고용이에요.",
    } as Record<string, string>,
    provenanceFallbackTab: "출처 신호",
    evidenceFallbackTab: (index: number) => `근거 ${index}`,
    noDescription: "세부 설명이 제공되지 않았어요.",
    noEvidence: "탐지된 세부 근거가 없어요.",
    fallbackNote: "AI 모델 응답에 실패해 실제 이미지 분석이 아닌 참고용 추정치가 표시되고 있어요.",
    modelNote: "AI 모델이 이미지를 분석한 결과예요.",
    modelLabel: (name: string, version: string | null) =>
      `분석 모델: ${name}${version ? ` (${version})` : ""}`,
  },
  {
    en: {
      band: {
        LOW: "No signs of synthesis found",
        UNCERTAIN: "Synthesis uncertain",
        HIGH: "High chance of synthesis",
        UNDETERMINED: "Can't determine",
      },
      bandLevel: { LOW: "Low", UNCERTAIN: "Unsure", HIGH: "High", UNDETERMINED: "-" },
      bandCaption: {
        LOW: "No signs of synthesis were found. This doesn't guarantee the photo is real.",
        UNCERTAIN: "It's hard to tell. Synthesis is uncertain, so please read the notes below.",
        HIGH: "There's a high chance this photo was synthesized.",
        UNDETERMINED: "We can't determine this photo. Please try another one.",
      },
      provenanceCaption: {
        HIGH: "The image file contains a record from an AI generation tool.",
        UNCERTAIN: "The image file indicates that part of it was edited with AI.",
      },
      undeterminedReason: {
        LOW_RESOLUTION:
          "The image is too small for an accurate analysis. Try again with the original photo.",
        NO_FACE_DETECTED:
          "We couldn't find a face, so we can't determine this. Try a photo where the face is clearly visible.",
      },
      failure: {
        NO_FACE_DETECTED: {
          title: "We couldn't find a face in the photo",
          description: "Try again with a photo that clearly shows the face from the front.",
        },
        VIDEO_NOT_SUPPORTED: {
          title: "Video detection isn't supported yet",
          description: "Try a photo captured from a scene where the face is clearly visible.",
        },
        AI_SERVER_ERROR: {
          title: "The AI analysis server is having a temporary problem",
          description: "Please try again in a moment.",
        },
        TIMEOUT: { title: "The analysis timed out", description: "Please try again in a moment." },
      },
      unknownFailure: { title: "Detection failed", description: "Please try again in a moment." },
      evidenceType: {
        BLINK_PATTERN_ANOMALY: "Blink pattern",
        COMPRESSION_ARTIFACT: "Compression artifacts",
        FACE_BOUNDARY: "Face boundary",
        LIGHTING_INCONSISTENCY: "Lighting consistency",
        SKIN_TEXTURE: "Skin texture",
        MOUTH_SYNC: "Mouth movement",
      },
      provenance: {
        GENERATOR_METADATA: "The image file has a record saying it was made with an AI tool.",
        AI_SOURCE_DECLARED: "The image file says the content was generated by AI.",
        AI_EDIT_DECLARED:
          "The image file says part of it was edited or synthesized with AI. This doesn't mean the whole image is AI-made.",
        C2PA_MANIFEST:
          "The image file contains Content Credentials (C2PA). The signature wasn't verified, so treat it as a hint.",
      },
      provenanceFallbackTab: "Source signal",
      evidenceFallbackTab: (index: number) => `Evidence ${index}`,
      noDescription: "No further details were provided.",
      noEvidence: "No detailed evidence was detected.",
      fallbackNote:
        "The AI model didn't respond, so this is a reference estimate rather than an actual image analysis.",
      modelNote: "This is the result of an AI model analyzing the image.",
      modelLabel: (name: string, version: string | null) =>
        `Model: ${name}${version ? ` (${version})` : ""}`,
    },
  },
);

type DetectionText = (typeof detectionMessages)["ko"];

function humanize(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** 출처 신호와 모델 근거를 한 목록으로 합쳐 화면에 보여줄 항목으로 만든다. */
export function evidenceItems(
  data: DeepfakeDetectionResponse,
  t: DetectionText,
): { title: string; description: string }[] {
  const provenance = (data.provenanceSignals ?? []).map((signal) => ({
    title: t.provenanceFallbackTab,
    description: t.provenance[signal.code] ?? signal.message ?? t.noDescription,
  }));
  const model = (data.evidences ?? []).map((evidence, index) => ({
    title: evidence.type
      ? (t.evidenceType[evidence.type] ?? humanize(evidence.type))
      : t.evidenceFallbackTab(index + 1),
    description: evidence.description || t.noDescription,
  }));
  return [...provenance, ...model];
}

export function bandCaption(
  data: DeepfakeDetectionResponse,
  band: DeepfakeBand,
  t: DetectionText,
): string {
  if (band === "UNDETERMINED") {
    const reason = data.undeterminedReason ? t.undeterminedReason[data.undeterminedReason] : null;
    return reason ?? t.bandCaption.UNDETERMINED;
  }
  if (data.assessmentBasis === "PROVENANCE") {
    return t.provenanceCaption[band] ?? t.bandCaption[band];
  }
  return t.bandCaption[band];
}
