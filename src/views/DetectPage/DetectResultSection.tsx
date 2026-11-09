"use client";

import Link from "next/link";
import FileText from "@/shared/asset/svg/FileText";
import Message from "@/shared/asset/svg/Message";
import Warning from "@/shared/asset/svg/Warning";
import { buttonStyle } from "@/shared/ui/Button";
import type { WebSearchResponse } from "./detectApi";
import type { DetectResult } from "./types";
import EvidenceHighlightCard from "./EvidenceHighlightCard";
import FaceTheftCard from "./FaceTheftCard";
import OverallRiskCard from "./OverallRiskCard";
import VerdictCard from "./VerdictCard";
import WebMatchCard from "./WebMatchCard";
import { useT } from "@/shared/i18n/I18nProvider";
import { detectMessages } from "./messages";

interface DetectResultSectionProps {
  result: DetectResult;
  previewUrl: string | null;
  webSearch: WebSearchResponse | null;
  webSearchOff: boolean;
  webSearchPending: boolean;
  onWebSearch: () => void;
}

export default function DetectResultSection({
  result,
  previewUrl,
  webSearch,
  webSearchOff,
  webSearchPending,
  onWebSearch,
}: DetectResultSectionProps) {
  const t = useT(detectMessages);
  const tr = t.result;
  return (
    <div className="flex w-full animate-[fade-in-up_0.4s_ease-out] flex-col gap-6 rounded-2xl border border-gray-300 p-5 md:gap-8 md:px-8 md:py-6">
      <p className="text-body-1 font-semibold text-black">{tr.title}</p>
      <div className="flex flex-col gap-4 md:gap-8 lg:flex-row">
        <FaceTheftCard
          webSearch={webSearch}
          off={webSearchOff}
          pending={webSearchPending}
          onStart={onWebSearch}
        />
        <VerdictCard
          title={tr.deepfake}
          verdict={result.deepfakeVerdict}
          score={result.deepfakeRiskScore}
          tone={result.deepfakeTone}
          band={result.deepfakeBand}
          scoreText={result.deepfakeBand ? tr.bandLevel[result.deepfakeBand] : undefined}
          scoreLabel={tr.probability}
          scoreSuffix="%"
          caption={result.deepfakeCaption}
        />
        <OverallRiskCard result={result} />
      </div>

      <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
        <EvidenceHighlightCard highlights={result.evidenceHighlights} previewUrl={previewUrl} />
        <WebMatchCard webSearch={webSearch} off={webSearchOff} pending={webSearchPending} />
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-4 md:px-6">
        <div className="flex items-start gap-2">
          <span className="text-gray-650 mt-0.5 shrink-0 [&>svg]:h-5 [&>svg]:w-5">
            <Warning />
          </span>
          <p className="text-small text-gray-700">{t.referenceNotice}</p>
        </div>
        {result.modelLabel && (
          <p className="text-caption text-gray-650 pl-7 break-all">{result.modelLabel}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:w-[536px] sm:flex-row sm:self-end">
        <Link
          href="/chat"
          className={buttonStyle("primary", "flex flex-1 items-center justify-center gap-2")}
        >
          <span className="[&>svg]:h-6 [&>svg]:w-6">
            <Message />
          </span>
          {tr.chat}
        </Link>
        <Link
          href="/report"
          className={buttonStyle("primary", "flex flex-1 items-center justify-center gap-2")}
        >
          <span className="[&>svg]:h-6 [&>svg]:w-6">
            <FileText />
          </span>
          {tr.report}
        </Link>
      </div>
    </div>
  );
}
