"use client";

import Warning from "@/shared/asset/svg/Warning";
import SuspicionBanner from "@/shared/ui/SuspicionBanner";
import { useT } from "@/shared/i18n/I18nProvider";
import { bandClass } from "./bandStyle";
import type { DeepfakeBand, DeepfakeVerdict } from "./detectApi";
import { detectMessages } from "./messages";

const toneClass: Record<DeepfakeVerdict, { bg: string; text: string }> = {
  FAKE: { bg: "bg-red-50", text: "text-red-500" },
  SUSPICIOUS: { bg: "bg-yellow-50", text: "text-yellow-500" },
  REAL: { bg: "bg-green-50", text: "text-green-500" },
};

function scoreToTone(score: number): DeepfakeVerdict {
  if (score >= 70) return "FAKE";
  if (score >= 40) return "SUSPICIOUS";
  return "REAL";
}

function scoreToSuspicionStatus(score: number): "의심" | "주의" | "의심없음" {
  if (score >= 70) return "의심";
  if (score >= 40) return "주의";
  return "의심없음";
}

interface VerdictCardProps {
  title: string;
  verdict: string;
  /** 값이 없으면(서버가 점수를 주지 않은 경우) "-"로 보여준다. */
  score: number | null;
  scoreLabel: string;
  scoreSuffix: string;
  caption: string;
  /** 판정 코드가 있으면 색을 점수 크기 대신 판정으로 정한다. */
  tone?: DeepfakeVerdict;
  band?: DeepfakeBand | null;
  scoreText?: string;
  suspicion?: boolean;
  unsupported?: boolean;
}

export default function VerdictCard({
  title,
  verdict,
  score,
  scoreLabel,
  scoreSuffix,
  caption,
  tone,
  band,
  scoreText,
  suspicion = false,
  unsupported = false,
}: VerdictCardProps) {
  const t = useT(detectMessages).result;
  const style = band ? bandClass[band] : toneClass[tone ?? scoreToTone(score ?? 0)];

  if (unsupported) {
    return (
      <div className="flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-5 md:p-6 lg:w-[364px]">
        <p className="text-body-1 font-semibold text-black">{title}</p>
        <div className="flex h-[60px] w-full items-center gap-3 rounded-lg bg-gray-100 px-5">
          <span className="shrink-0 text-gray-500 [&>svg]:h-8 [&>svg]:w-8">
            <Warning />
          </span>
          <p className="text-body-1 font-bold text-gray-500">{t.unsupported}</p>
        </div>
        <p className="text-body-2 text-gray-650 text-center">{caption}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-5 md:p-6 lg:w-[364px]">
      <p className="text-body-1 font-semibold text-black">{title}</p>
      {suspicion ? (
        <SuspicionBanner status={scoreToSuspicionStatus(score ?? 0)} />
      ) : (
        <div className={`flex h-[60px] w-full items-center gap-3 rounded-lg px-5 ${style.bg}`}>
          <span className={`shrink-0 ${style.text} [&>svg]:h-8 [&>svg]:w-8`}>
            <Warning />
          </span>
          <p className={`text-body-1 font-bold ${style.text}`}>{verdict}</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <p className="text-body-1 text-gray-800">{scoreLabel}</p>
        <p className={`text-h2 md:text-h1 font-bold ${style.text}`}>
          {scoreText ?? score ?? "-"}
          {scoreText === undefined && score !== null && (
            <span className="text-h3 font-semibold text-gray-500">{scoreSuffix}</span>
          )}
        </p>
        <div className="h-px w-full bg-gray-200" />
      </div>
      <p className="text-body-2 text-gray-650 text-center">{caption}</p>
    </div>
  );
}
