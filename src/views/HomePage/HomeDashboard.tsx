"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getMyAssessments, isCompletedAssessment } from "@/entities/analysis/api";
import { useMyProfile } from "@/entities/user/useMyProfile";
import ArrowUp from "@/shared/asset/svg/ArrowUp";
import AnalysisStepRow from "@/shared/ui/AnalysisStepRow";
import AnalysisStepStack from "@/shared/ui/AnalysisStepStack";
import FrameScale from "@/shared/ui/FrameScale";
import LinkButton from "@/shared/ui/LinkButton";
import TypingHeadline from "@/shared/ui/TypingHeadline";
import QuickFeaturesSection from "./QuickFeaturesSection";
import RecentResultsSection from "./RecentResultsSection";
import { useT } from "@/shared/i18n/I18nProvider";
import { homeMessages } from "./messages";

export default function HomeDashboard() {
  const t = useT(homeMessages);
  const { data: profile } = useMyProfile();
  const { data: assessments } = useQuery({
    queryKey: ["riskAssessments"],
    queryFn: getMyAssessments,
  });

  return (
    <main className="flex w-full flex-col items-center gap-8 bg-white pb-10 md:gap-16 md:pb-24">
      <section className="w-full bg-white">
        <FrameScale>
          <Image
            src="/images/landing/ellipse-blue.svg"
            alt=""
            width={824}
            height={824}
            className="pointer-events-none absolute -top-40 -right-40 h-[824px] w-[824px]"
          />
          <Image
            src="/images/landing/ellipse-purple.svg"
            alt=""
            width={824}
            height={824}
            className="pointer-events-none absolute -top-96 left-24 h-[824px] w-[824px]"
          />
          <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-12 px-5 py-8 md:py-20 xl:flex-row xl:items-center xl:justify-between xl:gap-16 xl:py-32">
            <div className="flex w-full flex-col items-start gap-3 md:w-fit md:items-center md:gap-6 md:text-center xl:items-start xl:text-left">
              <h1 className="md:text-h1 animate-[fade-in_0.8s_ease-out_both] text-[28px] leading-[1.3] font-bold break-keep text-black motion-reduce:animate-none xl:whitespace-nowrap">
                {t.greeting(profile?.name ?? t.defaultName)}
              </h1>
              <TypingHeadline
                as="p"
                speed={45}
                startDelay={600}
                className="text-body-2 md:text-body-1 break-keep text-gray-800 xl:whitespace-nowrap"
                lines={t.tagline.map((text) => [{ text }])}
              />
              <div className="w-full pt-3 md:w-auto md:pt-0">
                <LinkButton href="/analyze" variant="primary" className="w-full gap-1 md:w-auto">
                  {t.cta}
                  <span className="[&>svg]:h-6 [&>svg]:w-6">
                    <ArrowUp />
                  </span>
                </LinkButton>
              </div>
            </div>
            <div className="hidden w-full md:block xl:hidden [&_*]:animate-none">
              <AnalysisStepRow
                percent={72}
                riskPercent={24}
                level="안전"
                message={t.sampleMessage}
              />
            </div>
            <div className="hidden xl:block [&_*]:animate-none">
              <AnalysisStepStack
                percent={72}
                riskPercent={24}
                level="안전"
                message={t.sampleMessage}
              />
            </div>
          </div>
        </FrameScale>
      </section>
      <QuickFeaturesSection />
      <RecentResultsSection
        results={(assessments ?? []).filter(isCompletedAssessment).slice(0, 3)}
      />
    </main>
  );
}
