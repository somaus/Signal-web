import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/shared/config/env";
import { currentLocale } from "@/shared/i18n/currentLocale";
import { htmlLang } from "@/shared/i18n/config";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/shared/lib/authToken";
import { type ApiErrorCode, errorMessages, isApiErrorCode } from "./errorMessages";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code?: ApiErrorCode,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

const reissueClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ReissueResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

let reissuePromise: Promise<string | null> | null = null;

async function reissueAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await reissueClient.patch<ReissueResponse>("/api/v1/auth/reissue", {
      refreshToken,
    });
    await setAuthTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    // 재발급까지 실패하면 로그인이 풀린 것이다. 토큰을 지우면 구독 중인 화면이 로그인으로 보낸다.
    await clearAuthTokens();
    return null;
  }
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = htmlLang[currentLocale()];
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    const original = error.config as RetryableConfig | undefined;
    const isAuthEndpoint = original?.url?.includes("/api/v1/auth/");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      original &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;
      reissuePromise ??= reissueAccessToken().finally(() => {
        reissuePromise = null;
      });
      const newAccessToken = await reissuePromise;
      if (newAccessToken) {
        original.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return api.request(original);
      }
    }

    const locale = currentLocale();
    const t = errorMessages[locale];
    const data = error.response?.data;
    const code = isApiErrorCode(data?.code) ? data.code : undefined;
    const serverMessage = locale === "ko" ? data?.message : undefined;
    const fallback = error.response
      ? t.unknown
      : error.code === AxiosError.ECONNABORTED
        ? t.timeout
        : t.network;
    const message = serverMessage ?? (code ? t.codes[code] : undefined) ?? fallback;
    return Promise.reject(new ApiError(message, code));
  },
);
