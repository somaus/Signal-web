"use client";

import { useState } from "react";
import type { DetectResult } from "./types";
import { useT } from "@/shared/i18n/I18nProvider";
import { detectMessages } from "./messages";

interface EvidenceHighlightCardProps {
  highlights: DetectResult["evidenceHighlights"];
  previewUrl: string | null;
}

export default function EvidenceHighlightCard({
  highlights,
  previewUrl,
}: EvidenceHighlightCardProps) {
  const { result } = useT(detectMessages);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = highlights[activeIndex];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-5 md:px-8 md:py-6 lg:w-[800px]">
      <p className="text-body-1 font-semibold text-black">{result.evidenceTitle}</p>
      <div className="flex w-full overflow-x-auto [scrollbar-width:none]">
        {highlights.map((highlight, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`${index}-${highlight.tab}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`text-small h-9 min-w-[96px] shrink-0 rounded-t-lg border-t border-r border-l bg-white px-3 font-medium whitespace-nowrap transition-colors duration-200 md:min-w-[120px] ${
                isActive
                  ? "border-primary-500 text-primary-500"
                  : "border-b-primary-500 text-gray-650 border-b border-t-gray-300 border-r-gray-300 border-l-gray-300"
              }`}
            >
              {highlight.tab}
            </button>
          );
        })}
        <div className="border-b-primary-500 h-9 min-w-4 flex-1 border-b" />
      </div>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300">
        <div className="w-24 shrink-0 overflow-hidden bg-gray-100 md:h-[92px] md:w-[140px]">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex flex-1 items-center p-4 md:p-6">
          <p className="text-small md:text-body-2 text-primary-500 font-medium break-keep whitespace-pre-line">
            {active.description}
          </p>
        </div>
      </div>
    </div>
  );
}
