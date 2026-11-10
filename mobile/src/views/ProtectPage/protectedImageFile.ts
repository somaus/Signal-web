import { File, Paths } from "expo-file-system";
import { getProtection, protectionDownloadPath } from "@/entities/protection/api";
import { API_URL } from "@/shared/config/env";
import { htmlLang } from "@/shared/i18n/config";
import { currentLocale } from "@/shared/i18n/currentLocale";
import { getAccessToken } from "@/shared/lib/authToken";

// PNG 파일은 항상 이 8바이트로 시작한다.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { "Accept-Language": htmlLang[currentLocale()] };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** 서버가 준 경로가 상대 경로면 API 주소를 붙인다. */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function removeFile(file: File) {
  try {
    if (file.exists) file.delete();
  } catch {
    // 캐시라 지우지 못해도 OS가 나중에 정리한다.
  }
}

async function ensurePng(file: File) {
  const bytes = await file.bytes();
  if (!PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)) {
    removeFile(file);
    throw new Error("downloaded file is not a png");
  }
}

/**
 * 보호된 이미지를 앱 캐시에 파일로 받는다. 로그인이 필요해 인증 헤더를 붙인다.
 * 오류 응답이 이미지로 저장되지 않게 PNG인지 확인하고, 토큰이 만료됐으면 재발급 후 한 번 더 받는다.
 */
export async function downloadProtectedImage(protectionId: number): Promise<File> {
  const url = absoluteUrl(protectionDownloadPath(protectionId));
  const destination = new File(Paths.cache, `signal-protected-${protectionId}.png`);
  const attempt = async () => {
    const file = await File.downloadFileAsync(url, destination, {
      headers: await authHeaders(),
      idempotent: true,
    });
    await ensurePng(file);
    return file;
  };
  try {
    return await attempt();
  } catch {
    removeFile(destination);
    // 일반 API를 한 번 부르면 axios가 만료된 토큰을 재발급한다. 실패하면 그 ApiError가 올라간다.
    await getProtection(protectionId);
    try {
      return await attempt();
    } catch (error) {
      removeFile(destination);
      throw error;
    }
  }
}
