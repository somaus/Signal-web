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

/** 일반 JSON 요청의 타임아웃. */
const DEFAULT_TIMEOUT_MS = 10_000;
/** 사진·영상·증거 파일 업로드(multipart)의 타임아웃. 휴대폰 회선에서는 10초를 넘기기 쉽다. */
export const UPLOAD_TIMEOUT_MS = 60_000;

const clientConfig = {
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
};

/**
 * "호출부가 timeout을 정하지 않음" 표시. axios는 기본값도 0(제한 없음)이라 호출부가 직접 준 0·10초와
 * 구분할 수 없어서, 인스턴스 기본값을 이 값으로 두고 요청 인터셉터에서 이 값일 때만 채운다.
 */
const UNSET_TIMEOUT = -1;

export const api = axios.create({ ...clientConfig, timeout: UNSET_TIMEOUT });

const reissueClient = axios.create({ ...clientConfig, timeout: DEFAULT_TIMEOUT_MS });

function isUpload(config: InternalAxiosRequestConfig | undefined): boolean {
  return config?.data instanceof FormData;
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
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await reissueClient.patch<ReissueResponse>("/api/v1/auth/reissue", {
      refreshToken,
    });
    await setAuthTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    // 서버가 리프레시 토큰을 거절했을 때만 로그인이 풀린 것으로 본다.
    // 타임아웃·오프라인·5xx 같은 일시적 오류에는 토큰을 그대로 둔다.
    if (isRefreshTokenRejected(error)) await clearAuthTokens({ expired: true });
    return null;
  }
}

function isRefreshTokenRejected(error: unknown): boolean {
  if (!axios.isAxiosError<{ code?: string }>(error)) return false;
  return error.response?.status === 401 || error.response?.data?.code === "INVALID_REFRESH_TOKEN";
}

api.interceptors.request.use(async (config) => {
  // 호출부가 timeout을 정하지 않았으면 요청 종류에 맞춰 채운다. 0(제한 없음)을 포함해 직접 정한 값은 그대로 둔다.
  if (config.timeout === UNSET_TIMEOUT) {
    config.timeout = isUpload(config) ? UPLOAD_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;
  }
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

    // 서버는 인증이 없거나 만료되면 401, 권한이 부족하면 403을 준다. 재발급은 401만 처리한다.
    if (error.response?.status === 401 && original && !original._retry && !isAuthEndpoint) {
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
    // 에러 코드에 맞는 문구를 먼저 쓴다. 서버 메시지는 코드가 없는 4xx 응답의 한국어 안내로만 쓰고,
    // 서버 오류(5xx)의 메시지는 내부 정보가 섞일 수 있어 보여주지 않는다.
    const status = error.response?.status;
    const serverMessage =
      locale === "ko" && status !== undefined && status < 500 ? data?.message : undefined;
    const fallback = error.response
      ? t.unknown
      : error.code === AxiosError.ECONNABORTED
        ? isUpload(original)
          ? t.uploadTimeout
          : t.timeout
        : t.network;
    const message = (code ? t.codes[code] : undefined) ?? serverMessage ?? fallback;
    return Promise.reject(new ApiError(message, code));
  },
);
