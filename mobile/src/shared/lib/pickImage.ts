import * as ImagePicker from "expo-image-picker";

export interface PickedImage {
  uri: string;
  name: string;
  mimeType: "image/jpeg" | "image/png";
  width: number;
  height: number;
  fileSize: number | null;
}

export type PickResult =
  | { status: "picked"; image: PickedImage }
  | { status: "canceled" }
  | { status: "denied" }
  | { status: "unsupported" };

function toPickedImage(asset: ImagePicker.ImagePickerAsset): PickedImage | null {
  const mime = asset.mimeType?.toLowerCase();
  const uri = asset.uri.toLowerCase();
  const mimeType =
    mime === "image/png" || uri.endsWith(".png")
      ? "image/png"
      : mime === "image/jpeg" || mime === "image/jpg" || /\.jpe?g$/.test(uri)
        ? "image/jpeg"
        : null;
  if (!mimeType) return null;
  const extension = mimeType === "image/png" ? "png" : "jpg";
  return {
    uri: asset.uri,
    name: `photo-${Date.now()}.${extension}`,
    mimeType,
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize ?? null,
  };
}

function fromResult(result: ImagePicker.ImagePickerResult): PickResult {
  if (result.canceled || result.assets.length === 0) return { status: "canceled" };
  const image = toPickedImage(result.assets[0]);
  return image ? { status: "picked", image } : { status: "unsupported" };
}

// 서버는 JPG, PNG만 받는다. 0.9로 다시 인코딩해 용량을 줄이고, HEIC는 JPEG로 바뀐다.
const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 0.9,
  allowsMultipleSelection: false,
};

export async function pickFromLibrary(): Promise<PickResult> {
  return fromResult(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));
}

export async function takePhoto(): Promise<PickResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return { status: "denied" };
  return fromResult(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
}
