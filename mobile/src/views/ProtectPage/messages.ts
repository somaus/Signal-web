import { defineMessages } from "@/shared/i18n/defineMessages";
import type { ProtectionLevel } from "@/entities/protection/model";

interface LevelText {
  label: string;
  description: string;
}

export const protectMessages = defineMessages(
  {
    title: "이미지 보호",
    invalidId: "잘못된 분석 번호예요.",
    intro:
      "사진에 눈에 잘 띄지 않는 노이즈를 넣어 AI가 얼굴을 학습하거나 합성하기 어렵게 만들어요.",
    limit:
      "보호 처리는 도용·합성을 어렵게 할 뿐 완전히 막아 주지는 않아요. 이미 퍼진 사진에는 효과가 없고, 모든 AI 도구에 똑같이 통하지도 않아요.",
    loginTitle: "로그인이 필요해요",
    loginDescription: "이미지 보호는 로그인한 뒤에 쓸 수 있어요.",
    login: "로그인",
    levelTitle: "보호 강도",
    levels: {
      LIGHT: { label: "약하게", description: "사진이 거의 그대로 보이지만 보호 효과가 약해요." },
      NORMAL: { label: "보통 (권장)", description: "사진 품질과 보호 효과의 균형을 맞춰요." },
      STRONG: {
        label: "강하게",
        description: "보호 효과가 크지만 사진에 변화가 눈에 띌 수 있어요.",
      },
    } satisfies Record<ProtectionLevel, LevelText>,
    start: "보호 처리 시작",
    starting: "요청하는 중이에요",
    processing: "보호 처리 중이에요",
    processingCaption: "보통 몇 초에서 1분 정도 걸려요.",
    timeout: "보호 처리가 오래 걸리고 있어요. 잠시 후 다시 확인해 주세요.",
    failed: "이미지 보호 처리에 실패했어요.",
    retry: "다시 시도",
    downloading: "보호된 이미지를 받는 중이에요",
    downloadFailed: "보호된 이미지를 받지 못했어요.",
    compareTitle: "원본과 비교",
    original: "원본",
    protected: "보호됨",
    originalUnavailable: "원본 미리보기를 불러오지 못했어요.",
    applied: "이미지에 노이즈를 넣었어요. 도용·합성을 완전히 막아 주지는 않아요.",
    simulated: "현재 보호 처리는 시연용 단계라, 실제 노이즈가 들어가지 않은 원본 사본이 저장돼요.",
    save: "갤러리에 저장",
    saving: "저장하는 중이에요",
    saved: "보호된 이미지를 갤러리에 저장했어요.",
    saveFailed: "갤러리에 저장하지 못했어요.",
    share: "공유하기",
    shareFailed: "공유하지 못했어요.",
    permissionTitle: "사진 저장 권한이 필요해요",
    permissionDescription:
      "설정에서 Signal의 사진 접근을 허용하면 갤러리에 저장할 수 있어요. 저장 대신 공유하기로 다른 앱에 보낼 수도 있어요.",
    openSettings: "설정 열기",
    close: "닫기",
    again: "다른 강도로 다시 처리",
  },
  {
    en: {
      title: "Image protection",
      invalidId: "This analysis number is invalid.",
      intro:
        "We add subtle noise to the photo so it's harder for AI to learn or synthesize the face.",
      limit:
        "Protection makes theft and synthesis harder but can't fully prevent them. It doesn't help photos that are already out there, and it doesn't work the same against every AI tool.",
      loginTitle: "Please log in",
      loginDescription: "Image protection is available after you log in.",
      login: "Log in",
      levelTitle: "Protection strength",
      levels: {
        LIGHT: {
          label: "Light",
          description: "The photo looks almost the same, but protection is weaker.",
        },
        NORMAL: {
          label: "Normal (recommended)",
          description: "Balances photo quality and protection.",
        },
        STRONG: {
          label: "Strong",
          description: "Stronger protection, but changes may be noticeable.",
        },
      },
      start: "Start protection",
      starting: "Requesting",
      processing: "Protecting your image",
      processingCaption: "This usually takes a few seconds to a minute.",
      timeout: "Protection is taking a while. Please check again shortly.",
      failed: "Couldn't protect the image.",
      retry: "Try again",
      downloading: "Downloading the protected image",
      downloadFailed: "Couldn't download the protected image.",
      compareTitle: "Compare with the original",
      original: "Original",
      protected: "Protected",
      originalUnavailable: "Couldn't load the original preview.",
      applied: "We added noise to the image. It can't fully prevent theft or synthesis.",
      simulated:
        "Protection is currently a demo, so the saved copy is the original without real noise added.",
      save: "Save to gallery",
      saving: "Saving",
      saved: "Saved the protected image to your gallery.",
      saveFailed: "Couldn't save to your gallery.",
      share: "Share",
      shareFailed: "Couldn't share the image.",
      permissionTitle: "Photo access needed",
      permissionDescription:
        "Allow Signal to access your photos in Settings to save to your gallery. You can also share it to another app instead.",
      openSettings: "Open Settings",
      close: "Close",
      again: "Process again with another strength",
    },
  },
);
