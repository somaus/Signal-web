import type { PickedImage } from "@/shared/lib/pickImage";
import { guestHeaders } from "./guestHeaders";

/** 사진 업로드는 일반 요청(10초)보다 오래 걸릴 수 있어 타임아웃을 따로 둔다. */
export const UPLOAD_TIMEOUT_MS = 60_000;

/** React Native의 FormData는 { uri, name, type } 객체를 파일로 보낸다. */
export function imageForm(field: string, image: PickedImage): FormData {
  const form = new FormData();
  form.append(field, { uri: image.uri, name: image.name, type: image.mimeType } as unknown as Blob);
  return form;
}

export async function uploadConfig() {
  return {
    headers: { "Content-Type": "multipart/form-data", ...(await guestHeaders()) },
    timeout: UPLOAD_TIMEOUT_MS,
  };
}
