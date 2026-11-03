"use client";

import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { isWebUrl } from "@/shared/lib/url";
import { isSameImageMatch, webMatchMessages } from "@/shared/lib/webMatch";
import type { WebSearchResponse } from "./detectApi";
import { detectMessages } from "./messages";
import { getWebSearchOutcome } from "./webSearchOutcome";

const COLLAPSED_COUNT = 3;

interface WebMatchCardProps {
  webSearch: WebSearchResponse | null;
  off: boolean;
  pending: boolean;
}

export default function WebMatchCard({ webSearch, off, pending }: WebMatchCardProps) {
  const messages = useT(detectMessages);
  const t = messages.webSearch;
  const tr = messages.result;
  const matchTypeLabel = useT(webMatchMessages);
  const [expanded, setExpanded] = useState(false);
  const outcome = pending ? "SEARCHING" : getWebSearchOutcome(webSearch);
  const matches = (webSearch?.matches ?? []).filter((match) => isWebUrl(match.pageUrl));
  const visible = expanded ? matches : matches.slice(0, COLLAPSED_COUNT);

  function placeholder(): string {
    if (off) return tr.webUnsupported;
    if (outcome === "IDLE") return t.listIdle;
    if (outcome === "SEARCHING") return t.searching;
    return t.listEmpty;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-5 md:px-8 md:py-6 lg:w-[400px]">
      <p className="text-body-1 font-semibold text-black">{tr.webTitle}</p>

      {off || matches.length === 0 ? (
        <p className="text-body-2 text-gray-650 break-keep">{placeholder()}</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {visible.map((match) => (
              <li key={match.pageUrl}>
                <a
                  href={match.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:border-primary-300 flex min-w-0 flex-col gap-1 rounded-lg border border-gray-200 p-3 transition-colors"
                >
                  <span
                    className={`text-caption font-semibold ${
                      isSameImageMatch(match.matchType) ? "text-red-500" : "text-yellow-500"
                    }`}
                  >
                    {matchTypeLabel[match.matchType]}
                  </span>
                  <span className="text-small truncate text-black">
                    {match.title || t.untitled}
                  </span>
                  {match.domain && (
                    <span className="text-caption text-gray-650 truncate">{match.domain}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-caption text-gray-650 break-keep">{t.listNote}</p>
          {matches.length > COLLAPSED_COUNT && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="border-primary-500 text-primary-500 text-body-2 flex h-[50px] w-full items-center justify-center rounded border"
            >
              {expanded ? t.showLess : `${tr.viewAll} (${matches.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
