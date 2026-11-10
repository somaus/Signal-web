import { defineMessages } from "@/shared/i18n/defineMessages";

export const imagePickerMessages = defineMessages(
  {
    empty: "갤러리에서 고르거나 바로 찍을 수 있어요.",
    previewLabel: "선택한 사진 미리보기",
    pickGallery: "갤러리에서 사진 선택",
    change: "다른 사진 선택",
    takePhoto: "카메라로 사진 촬영",
    fileTypes: "JPG, PNG 사진을 올릴 수 있어요.",
    cameraDenied: "카메라 권한이 없어요. 설정에서 카메라 접근을 허용해 주세요.",
    openSettings: "설정 열기",
    unsupported: "JPG, PNG 형식의 사진만 올릴 수 있어요.",
    failed: "사진을 불러오지 못했어요. 다시 시도해 주세요.",
    tooLarge: (mb: number) =>
      `사진이 너무 커요. ${mb}MB 이하, 6,400만 화소 이하의 사진을 골라 주세요.`,
  },
  {
    en: {
      empty: "Choose from your gallery or take one now.",
      previewLabel: "Preview of the selected photo",
      pickGallery: "Choose from gallery",
      change: "Choose another photo",
      takePhoto: "Take a photo",
      fileTypes: "JPG and PNG photos are supported.",
      cameraDenied: "Camera access is off. Allow camera access in Settings.",
      openSettings: "Open Settings",
      unsupported: "Only JPG and PNG photos can be uploaded.",
      failed: "Couldn't load the photo. Please try again.",
      tooLarge: (mb: number) =>
        `This photo is too large. Choose one that's ${mb}MB or smaller and under 64 megapixels.`,
    },
  },
);
