import { Asset, requestPermissionsAsync } from "expo-media-library";

export type SaveResult = "saved" | "denied";

/**
 * 갤러리에 사진을 저장한다. 쓰기 권한만 요청한다.
 * 권한을 거부하면 예외 대신 "denied"를 돌려줘서 화면이 안내를 띄우게 한다.
 */
export async function saveImageToGallery(fileUri: string): Promise<SaveResult> {
  const permission = await requestPermissionsAsync(true, ["photo"]);
  if (!permission.granted) return "denied";
  await Asset.create(fileUri);
  return "saved";
}
