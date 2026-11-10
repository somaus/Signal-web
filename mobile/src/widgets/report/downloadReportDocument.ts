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

/** 받은 파일이 PDF가 아니다(서버 오류 응답이 파일로 저장된 경우 등). */
class NotPdfError extends Error {
  constructor() {
    super("downloaded file is not a pdf");
    this.name = "NotPdfError";
  }
}

// PDF 파일은 항상 "%PDF"로 시작한다.
const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46];

async function requestHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { "Accept-Language": htmlLang[currentLocale()] };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** 신고 문서는 피해 사실이 담긴 민감한 파일이라 쓰고 나면 바로 지운다. */
function removeFile(file: File) {
  try {
    if (file.exists) file.delete();
  } catch {
    // 지우지 못해도 캐시라 OS가 나중에 정리한다. 사용자 흐름은 막지 않는다.
  }
}

/** 오류 응답(JSON 등)이 .pdf로 저장돼 깨진 문서를 여는 일이 없게 앞 4바이트를 확인한다. */
async function ensurePdf(file: File) {
  const bytes = await file.bytes();
  const isPdf = PDF_SIGNATURE.every((byte, index) => bytes[index] === byte);
  if (!isPdf) {
    removeFile(file);
    throw new NotPdfError();
  }
}

/**
 * 로그인이 필요한 PDF라 링크로 열 수 없어서, 인증 헤더를 붙여 앱 캐시에 파일로 받는다.
 * 같은 신고서를 다시 받으면 파일을 덮어쓴다.
 */
async function downloadPdf(reportId: number): Promise<File> {
  const url = `${API_URL}${reportDocumentPath(reportId)}`;
  const destination = new File(Paths.cache, `signal-report-${reportId}.pdf`);
  const attempt = async () => {
    const file = await File.downloadFileAsync(url, destination, {
      headers: await requestHeaders(),
      idempotent: true,
    });
    await ensurePdf(file);
    return file;
  };
  try {
    return await attempt();
  } catch {
    // Android는 받는 도중 실패하면 일부만 쓰인 파일이 남을 수 있어서 먼저 지운다.
    removeFile(destination);
    // 액세스 토큰이 만료됐을 수 있다. 일반 API를 한 번 부르면 axios가 토큰을 재발급한다.
    // 이 호출이 실패하면 그 ApiError(사용자에게 보여줄 문구)가 그대로 올라간다.
    await getReport(reportId);
    try {
      return await attempt();
    } catch (error) {
      removeFile(destination);
      throw error;
    }
  }
}

/** PDF를 받아 공유 시트로 연다. 공유 시트가 없으면 기기 미리보기로 연다. */
export async function downloadAndOpenReportDocument(
  reportId: number,
  dialogTitle: string,
): Promise<void> {
  const file = await downloadPdf(reportId);
  if (await Sharing.isAvailableAsync()) {
    try {
      // 공유 시트가 닫힌 뒤에 끝나므로, 다른 앱이 파일을 다 읽은 다음에 지운다.
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
        dialogTitle,
      });
    } finally {
      removeFile(file);
    }
    return;
  }
  // 미리보기는 화면을 띄우는 순간 끝나서(닫힐 때가 아님) 이때 지우면 뷰어가 파일을 못 읽는다.
  // 이 경우만 캐시에 두고, 다음에 같은 문서를 받을 때 덮어쓴다.
  if (await file.canPreview()) {
    await file.preview();
    return;
  }
  removeFile(file);
  throw new CannotOpenDocumentError();
}
