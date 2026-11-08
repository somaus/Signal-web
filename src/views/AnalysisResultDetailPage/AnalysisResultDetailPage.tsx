"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAssessment, isCompletedAssessment } from "@/entities/analysis/api";
import { mapAssessment } from "@/entities/analysis/model";
import { shareAnalysisResult } from "@/features/analysis-share/shareAnalysisResult";
import Arrow from "@/shared/asset/svg/Arrow";
import Share from "@/shared/asset/svg/Share";
import BackButton from "@/shared/ui/BackButton";
import LinkButton from "@/shared/ui/LinkButton";
import { useIsLoggedIn } from "@/shared/lib/useIsLoggedIn";
import Footer from "@/widgets/Footer";
import SiteHeader from "@/widgets/SiteHeader";
import ResponseGuideCard from "./ResponseGuideCard";
import ResultActions from "./ResultActions";
import ResultMobileHeader from "./ResultMobileHeader";
import ResultSummaryCard from "./ResultSummaryCard";
import RiskFactorList from "./RiskFactorList";
import RiskLevelCard from "./RiskLevelCard";
import { useLocale, useT } from "@/shared/i18n/I18nProvider";
import { resultMessages } from "./messages";
import { uiMessages } from "@/shared/ui/messages";

interface AnalysisResultDetailPageProps {
  id: string;
}

export default function AnalysisResultDetailPage({ id }: AnalysisResultDetailPageProps) {
  const assessmentId = Number(id);
  const isLoggedIn = useIsLoggedIn();
  const t = useT(resultMessages);
  const ui = useT(uiMessages);
  const { locale } = useLocale();

  const {
    data: assessment,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["riskAssessments", assessmentId],
    queryFn: () => getAssessment(assessmentId),
    enabled: Number.isFinite(assessmentId),
    refetchInterval: (query) => (query.state.data?.status === "PROCESSING" ? 3000 : false),
  });

  const result =
    assessment && isCompletedAssessment(assessment) ? mapAssessment(assessment, locale) : null;

  return (
    <>
      <SiteHeader className="max-md:hidden print:hidden" />
      <ResultMobileHeader onShare={result ? () => shareAnalysisResult(result) : undefined} />
      <main
        className={`flex w-full flex-col items-center bg-gray-100 px-5 py-5 md:bg-white md:py-10 md:pb-[120px] ${
          result ? "max-md:pb-[184px]" : "max-md:pb-10"
        }`}
      >
        <div className="flex w-full max-w-[1280px] animate-[fade-in-up_0.5s_ease-out] flex-col gap-6 md:gap-8">
          <div className="hidden flex-col gap-6 md:flex">
            <div className="flex items-center gap-4 print:hidden">
              <Link href="/" className="text-body-1 text-gray-800">
                {ui.home}
              </Link>
              <span className="text-gray-800 [&>svg]:h-[18px] [&>svg]:w-[18px]">
                <Arrow />
              </span>
              <Link href="/analyze" className="text-body-1 text-gray-800">
                {t.analyzeTitle}
              </Link>
              <span className="text-gray-800 [&>svg]:h-[18px] [&>svg]:w-[18px]">
                <Arrow />
              </span>
              <span className="text-body-1 text-primary-500">{t.title}</span>
            </div>
            <BackButton href="/analyze" className="self-start print:hidden" />
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-h2 lg:text-h1 font-bold text-black">{t.title}</h1>
              {result && (
                <button
                  type="button"
                  onClick={() => shareAnalysisResult(result)}
                  className="text-body-2 text-primary-500 border-primary-500 hover:bg-primary-50 flex h-[50px] shrink-0 cursor-pointer items-center gap-2 rounded border px-5 transition-colors print:hidden [&>svg]:h-4 [&>svg]:w-3.5"
                >
                  <Share />
                  {t.share}
                </button>
              )}
            </div>
          </div>

          {!Number.isFinite(assessmentId) && (
            <p className="text-body-1 text-red-500">{t.invalidId}</p>
          )}

          {isPending && Number.isFinite(assessmentId) && (
            <p className="text-body-1 text-gray-700">{t.loading}</p>
          )}

          {isError && (
            <p className="text-body-1 text-red-500">
              {t.loadFailed}
              {error instanceof Error ? ` (${error.message})` : ""}
            </p>
          )}

          {assessment && !result && (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-gray-300 bg-white p-5 md:p-8">
              {assessment.status === "PROCESSING" ? (
                <>
                  <p className="text-body-1 font-semibold text-black">{t.processingTitle}</p>
                  <p className="text-body-2 text-gray-700">{t.processingDescription}</p>
                </>
              ) : (
                <>
                  <p className="text-body-1 font-semibold text-black">{t.failedTitle}</p>
                  <p className="text-body-2 text-gray-700">
                    {(assessment.failureReason && t.failure[assessment.failureReason]) ||
                      t.failedFallback}
                  </p>
                  <LinkButton href="/analyze" variant="primary" className="mt-2">
                    {t.analyzeAgain}
                  </LinkButton>
                </>
              )}
            </div>
          )}

          {assessment && result && (
            <>
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
                <div className="flex flex-col gap-6 lg:gap-8">
                  <ResultSummaryCard
                    assessmentId={assessment.assessmentId}
                    faceCount={assessment.faces.length}
                  />
                  <RiskLevelCard
                    score={result.score}
                    level={result.level}
                    description={result.description}
                  />
                </div>
                <div className="flex flex-col gap-6 lg:gap-8">
                  {result.factors.length > 0 && <RiskFactorList factors={result.factors} />}
                  {result.recommendations.length > 0 && (
                    <ResponseGuideCard items={result.recommendations} />
                  )}
                </div>
              </div>
              <ResultActions aboveBottomNav={isLoggedIn} onSave={() => window.print()} />
            </>
          )}
        </div>
      </main>
      <div className="max-md:hidden print:hidden">
        <Footer />
      </div>
    </>
  );
}
