"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAgencies } from "@/entities/agency/api";
import { getReport } from "@/entities/report/api";
import PageHeading from "@/shared/ui/PageHeading";
import Footer from "@/widgets/Footer";
import SiteHeader from "@/widgets/SiteHeader";
import AgencyCard from "./AgencyCard";
import AttachedReportCard from "./AttachedReportCard";
import { situationTypes, useSituationCategories } from "./situationCategories";
import SituationSelect from "./SituationSelect";
import { useT } from "@/shared/i18n/I18nProvider";
import { referralMessages } from "./messages";

interface SupportReferralPageProps {
  reportId: number | null;
}

export default function SupportReferralPage({ reportId }: SupportReferralPageProps) {
  const t = useT(referralMessages);
  const situationCategories = useSituationCategories();
  const [selectedType, setSelectedType] = useState(situationTypes[0]);
  const selected =
    situationCategories.find((category) => category.type === selectedType) ??
    situationCategories[0];

  const {
    data: agencies,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["agencies", selectedType],
    queryFn: () => getAgencies(selectedType),
  });

  const { data: report } = useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReport(reportId as number),
    enabled: reportId !== null,
    retry: false,
  });
  const attachedReportId = report?.reportId;

  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-col items-center bg-white px-5 py-6 pb-[120px] md:py-10">
        <div className="flex w-full max-w-[1280px] animate-[fade-in-up_0.5s_ease-out] flex-col gap-6 md:gap-8">
          <PageHeading
            title={t.title}
            description={t.description}
            breadcrumbs={[{ label: t.chatbot, href: "/chat" }, { label: t.title }]}
          />

          {attachedReportId !== undefined && <AttachedReportCard reportId={attachedReportId} />}

          <div className="bg-primary-50 flex flex-col items-start justify-between gap-5 rounded-2xl p-5 sm:flex-row md:gap-6 md:p-6">
            <div className="flex flex-col gap-1">
              <p className="text-small text-gray-700">{t.currentSituation}</p>
              <p className="text-large md:text-h3 font-semibold text-black">{selected.label}</p>
              <p className="text-small md:text-large break-keep text-gray-700">
                {selected.description}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-[280px]">
              <label className="text-small md:text-large px-1 font-medium text-black">
                {t.changeSituation}
              </label>
              <SituationSelect
                categories={situationCategories}
                selectedType={selectedType}
                onSelect={(type) => setSelectedType(type as (typeof situationTypes)[number])}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-large md:text-h3 px-1 font-semibold text-black">{t.agencies}</p>

            {isPending && <p className="text-body-1 px-1 text-gray-700">{t.loading}</p>}

            {isError && (
              <p className="text-body-1 px-1 text-red-500">
                {t.loadFailed}
                {error instanceof Error ? ` (${error.message})` : ""}
              </p>
            )}

            {agencies && agencies.length === 0 && (
              <p className="text-body-1 px-1 text-gray-700">{t.empty}</p>
            )}

            {agencies && agencies.length > 0 && (
              <div className="flex flex-col gap-4">
                {agencies.map((agency) => (
                  <AgencyCard key={agency.agencyId} agency={agency} reportId={attachedReportId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
