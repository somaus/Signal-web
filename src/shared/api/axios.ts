import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/shared/lib/authToken";
import { htmlLang } from "@/shared/i18n/config";
import { currentLocale } from "@/shared/i18n/currentLocale";
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

/** 일반 JSON 요청의 타임아웃. */
const DEFAULT_TIMEOUT_MS = 10_000;
/** 사진·영상·증거 파일 업로드(multipart)의 타임아웃. 서버는 영상을 100MB까지 받는다. */
export const UPLOAD_TIMEOUT_MS = 60_000;

// 기본 타임아웃을 인스턴스에 두지 않는다. 두면 호출부가 직접 정한 값(예: 10초)과 기본값을 구분할 수 없어서,
// 요청 인터셉터에서 호출부가 정하지 않은 요청(0)에만 일반 10초, 업로드 60초를 채운다.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const reissueClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

function isUpload(config: InternalAxiosRequestConfig | undefined): boolean {
  return typeof FormData !== "undefined" && config?.data instanceof FormData;
}

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
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await reissueClient.patch<ReissueResponse>("/api/v1/auth/reissue", {
      refreshToken,
    });
    setAuthTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    clearAuthTokens();
    return null;
  }
}

api.interceptors.request.use((config) => {
  // 호출부가 timeout을 정하지 않았으면(axios 기본값 0) 요청 종류에 맞춰 채운다. 정했으면 그대로 둔다.
  if (!config.timeout) {
    config.timeout = isUpload(config) ? UPLOAD_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;
  }
  if (typeof window !== "undefined") {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Accept-Language"] = htmlLang[currentLocale()];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    const original = error.config as RetryableConfig | undefined;
    const isAuthEndpoint = original?.url?.includes("/api/v1/auth/");

    if (
      typeof window !== "undefined" &&
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
    if (process.env.NODE_ENV !== "production" && data?.code && !code) {
      console.warn(`[api] errorMessages에 없는 에러 코드: ${data.code}`, data.message);
    }
    const serverMessage = locale === "ko" ? data?.message : undefined;
    const fallback = error.response
      ? t.unknown
      : error.code === AxiosError.ECONNABORTED
        ? isUpload(original)
          ? t.uploadTimeout
          : t.timeout
        : t.network;
    const message = serverMessage ?? (code ? t.codes[code] : undefined) ?? fallback;
    return Promise.reject(new ApiError(message, code));
  },
);
