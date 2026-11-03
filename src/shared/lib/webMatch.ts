import { defineMessages } from "@/shared/i18n/defineMessages";

export type WebMatchType = "FULL" | "PARTIAL" | "PAGE" | "SIMILAR";

export function isSameImageMatch(matchType: WebMatchType): boolean {
  return matchType === "FULL" || matchType === "PARTIAL";
}

export const webMatchMessages = defineMessages(
  {
    FULL: "동일 이미지",
    PARTIAL: "일부 일치",
    PAGE: "같은 페이지에 노출",
    SIMILAR: "비슷한 이미지",
  } as Record<WebMatchType, string>,
  {
    en: {
      FULL: "Same image",
      PARTIAL: "Partial match",
      PAGE: "Appears on the same page",
      SIMILAR: "Similar image",
    },
    ja: {
      FULL: "同一画像",
      PARTIAL: "一部一致",
      PAGE: "同じページに掲載",
      SIMILAR: "似た画像",
    },
    zh: {
      FULL: "相同图片",
      PARTIAL: "部分一致",
      PAGE: "出现在同一网页",
      SIMILAR: "相似图片",
    },
  },
);
