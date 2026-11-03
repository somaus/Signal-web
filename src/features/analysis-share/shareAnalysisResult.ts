import { toast } from "sonner";
import type { AnalysisResult } from "@/entities/analysis/model";
import { SITE_URL } from "@/shared/config/site";
import { translate } from "@/shared/i18n/currentLocale";
import { uiMessages } from "@/shared/ui/messages";
import { analysisShareMessages } from "./messages";

function buildShareText(result: AnalysisResult) {
  const t = translate(analysisShareMessages);
  const level = translate(uiMessages).riskLevel[result.level];
  const topFactors = [...result.factors]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((factor) => `- ${factor.title} ${factor.score}%`);
  return [
    t.heading,
    t.risk(level, result.score),
    result.description.replace(/\n/g, " "),
    ...(topFactors.length > 0 ? ["", t.topFactors, ...topFactors] : []),
  ].join("\n");
}

export async function shareAnalysisResult(result: AnalysisResult) {
  const t = translate(analysisShareMessages);
  const text = buildShareText(result);
  if (navigator.share) {
    try {
      await navigator.share({ title: t.title, text, url: SITE_URL });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error(t.failed);
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(`${text}

${SITE_URL}`);
    toast.success(t.copied);
  } catch {
    toast.error(t.copyFailed);
  }
}
