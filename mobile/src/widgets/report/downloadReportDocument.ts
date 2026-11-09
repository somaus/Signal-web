import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getReport, reportDocumentPath } from "@/entities/report/api";
import { API_URL } from "@/shared/config/env";
import { htmlLang } from "@/shared/i18n/config";
import { currentLocale } from "@/shared/i18n/currentLocale";
import { getAccessToken } from "@/shared/lib/authToken";

/** 공유 시트도, 미리보기도 쓸 수 없는 기기. */
export class CannotOpenDocumentError extends Error {
  constructor() {
    super("cannot open document");
    this.name = "CannotOpenDocumentError";
  }
}

async function requestHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { "Accept-Language": htmlLang[currentLocale()] };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * 로그인이 필요한 PDF라 링크로 열 수 없어서, 인증 헤더를 붙여 앱 캐시에 파일로 받는다.
 * 같은 신고서를 다시 받으면 파일을 덮어쓴다.
 */
async function downloadPdf(reportId: number): Promise<File> {
  const url = `${API_URL}${reportDocumentPath(reportId)}`;
  const destination = new File(Paths.cache, `signal-report-${reportId}.pdf`);
  const attempt = async () =>
    File.downloadFileAsync(url, destination, { headers: await requestHeaders(), idempotent: true });
  try {
    return await attempt();
  } catch {
    // 액세스 토큰이 만료됐을 수 있다. 일반 API를 한 번 부르면 axios가 토큰을 재발급한다.
    // 이 호출이 실패하면 그 ApiError(사용자에게 보여줄 문구)가 그대로 올라간다.
    await getReport(reportId);
    return attempt();
  }
}

/** PDF를 받아 공유 시트로 연다. 공유 시트가 없으면 기기 미리보기로 연다. */
export async function downloadAndOpenReportDocument(
  reportId: number,
  dialogTitle: string,
): Promise<void> {
  const file = await downloadPdf(reportId);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
      dialogTitle,
    });
    return;
  }
  if (await file.canPreview()) {
    await file.preview();
    return;
  }
  throw new CannotOpenDocumentError();
}
