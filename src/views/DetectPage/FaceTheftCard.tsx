"use client";

import Warning from "@/shared/asset/svg/Warning";
import Button from "@/shared/ui/Button";
import { useT } from "@/shared/i18n/I18nProvider";
import type { WebSearchResponse } from "./detectApi";
import { detectMessages } from "./messages";
import { getWebSearchOutcome, type WebSearchOutcome } from "./webSearchOutcome";

const outcomeClass: Record<WebSearchOutcome, { bg: string; text: string }> = {
  IDLE: { bg: "bg-gray-100", text: "text-gray-650" },
  SEARCHING: { bg: "bg-gray-100", text: "text-gray-650" },
  FOUND: { bg: "bg-red-50", text: "text-red-500" },
  SIMILAR_ONLY: { bg: "bg-yellow-50", text: "text-yellow-500" },
  NONE: { bg: "bg-gray-100", text: "text-gray-650" },
  UNAVAILABLE: { bg: "bg-gray-100", text: "text-gray-650" },
  FAILED: { bg: "bg-gray-100", text: "text-gray-650" },
};

interface FaceTheftCardProps {
  webSearch: WebSearchResponse | null;
  off: boolean;
  pending: boolean;
  onStart: () => void;
}

export default function FaceTheftCard({ webSearch, off, pending, onStart }: FaceTheftCardProps) {
  const messages = useT(detectMessages);
  const t = messages.webSearch;
  const tr = messages.result;
  const outcome: WebSearchOutcome = pending ? "SEARCHING" : getWebSearchOutcome(webSearch);
  const style = outcomeClass[outcome];
  const showCount = outcome === "FOUND" || outcome === "SIMILAR_ONLY" || outcome === "NONE";

  function caption(): string {
    if (outcome === "SEARCHING") return t.searchingCaption;
    if (outcome === "UNAVAILABLE") {
      const reason = webSearch?.unavailableReason;
      return reason ? t.unavailable[reason] : t.state.UNAVAILABLE;
    }
    if (outcome === "IDLE") return t.consent;
    return t.caption[outcome];
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-5 md:p-6 lg:w-[364px]">
      <p className="text-body-1 font-semibold text-black">{tr.faceTheft}</p>
      <div
        className={`flex min-h-[60px] w-full items-center gap-3 rounded-lg px-5 py-3 ${off ? "bg-gray-100" : style.bg}`}
      >
        <span className={`shrink-0 ${off ? "text-gray-500" : style.text} [&>svg]:h-8 [&>svg]:w-8`}>
          <Warning />
        </span>
        <p className={`text-body-1 font-bold ${off ? "text-gray-500" : style.text}`}>
          {off ? tr.unsupported : outcome === "SEARCHING" ? t.searching : t.state[outcome]}
        </p>
      </div>

      {!off && showCount && (
        <div className="flex flex-col gap-3">
          <p className="text-body-1 text-gray-800">{t.countLabel}</p>
          <p className={`text-h2 md:text-h1 font-bold ${style.text}`}>
            {webSearch?.matchCount ?? 0}
            {t.countSuffix && (
              <span className="text-h3 font-semibold text-gray-500">{t.countSuffix}</span>
            )}
          </p>
          <div className="h-px w-full bg-gray-200" />
        </div>
      )}

      <p className="text-body-2 text-gray-650 text-center break-keep">
        {off ? messages.faceTheftCaption : caption()}
      </p>

      {!off && outcome === "IDLE" && (
        <Button type="button" variant="primary" className="w-full" onClick={onStart}>
          {t.start}
        </Button>
      )}
    </div>
  );
}
