"use client";

import { useState } from "react";
import { createConnection, type AgencyResponse } from "@/entities/agency/api";
import Clock from "@/shared/asset/svg/Clock";
import HandHeart from "@/shared/asset/svg/HandHeart";
import Phone from "@/shared/asset/svg/Phone";
import { useT } from "@/shared/i18n/I18nProvider";
import { referralMessages } from "./messages";

interface AgencyCardProps {
  agency: AgencyResponse;
  reportId?: number;
}

function extractDialNumber(phone: string) {
  const match = phone.match(/[\d-]+/);
  return match ? match[0].replace(/-/g, "") : phone;
}

export default function AgencyCard({ agency, reportId }: AgencyCardProps) {
  const { agencyId, name, phone, website, availableHours, supportedActions } = agency;
  const t = useT(referralMessages);
  const [isConnecting, setIsConnecting] = useState(false);

  async function recordConnection(connectionType: "PHONE" | "WEB") {
    setIsConnecting(true);
    try {
      await createConnection(agencyId, { connectionType, reportId });
    } catch {
      // 연결 기록 실패는 사용자 흐름(전화 연결/사이트 이동)을 막지 않음
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-gray-300 bg-white p-5 md:gap-8 md:p-8 lg:flex-row lg:justify-between">
      <div className="flex flex-col gap-3">
        <p className="text-large md:text-h3 font-semibold break-keep text-black">{name}</p>
        <div className="flex flex-col gap-2 pt-1">
          {availableHours && (
            <div className="flex items-start gap-2 md:items-center">
              <span className="shrink-0 text-gray-700 [&>svg]:h-5 [&>svg]:w-5">
                <Clock />
              </span>
              <span className="text-small md:text-large shrink-0 text-gray-700">{t.hours}</span>
              <span className="text-small break-keep text-gray-700">{availableHours}</span>
            </div>
          )}
          {supportedActions && supportedActions.length > 0 && (
            <div className="flex items-start gap-2 md:items-center">
              <span className="shrink-0 text-gray-700 [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6">
                <HandHeart />
              </span>
              <span className="text-small md:text-large shrink-0 text-gray-700">{t.supports}</span>
              <span className="text-small break-keep text-gray-700">
                {supportedActions.join(" · ")}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 border-t border-gray-300 pt-5 md:pt-6 lg:w-[381px] lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        {phone && (
          <div className="flex flex-col gap-1">
            <p className="text-caption text-gray-700">{t.hotline}</p>
            <p className="md:text-h3 text-primary-450 text-xl font-bold break-keep">{phone}</p>
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          {phone && (
            <a
              href={`tel:${extractDialNumber(phone)}`}
              onClick={() => recordConnection("PHONE")}
              className="border-primary-500 text-primary-500 text-body-2 md:text-large hover:bg-primary-50 flex flex-1 items-center justify-center gap-2 rounded border px-6 py-3 transition-colors"
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5">
                <Phone />
              </span>
              {t.call}
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              onClick={() => recordConnection("WEB")}
              className="bg-primary-500 text-body-2 md:text-large hover:bg-primary-400 flex flex-1 items-center justify-center rounded px-6 py-3 text-white transition-colors"
            >
              {t.online}
            </a>
          )}
        </div>
        {!phone && !website && <p className="text-caption text-gray-700">{t.noContact}</p>}
        {isConnecting && <p className="text-caption text-gray-700">{t.recording}</p>}
      </div>
    </div>
  );
}
