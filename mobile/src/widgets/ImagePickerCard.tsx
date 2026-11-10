import { useState } from "react";
import { Image, Linking, View } from "react-native";
import { useMessages } from "@/shared/i18n/I18nProvider";
import { pickFromLibrary, takePhoto } from "@/shared/lib/pickImage";
import type { PickedImage, PickResult } from "@/shared/lib/pickImage";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Text from "@/shared/ui/Text";
import { imagePickerMessages } from "./imagePickerMessages";

const MAX_PIXELS = 64_000_000;

interface ImagePickerCardProps {
  image: PickedImage | null;
  onPick: (image: PickedImage) => void;
  /** 업로드 중에는 사진을 바꾸지 못하게 한다. */
  disabled?: boolean;
  maxBytes: number;
}

/** 갤러리에서 고르거나 카메라로 찍은 사진을 미리 보여준다. 분석·탐지 화면이 함께 쓴다. */
export default function ImagePickerCard({
  image,
  onPick,
  disabled = false,
  maxBytes,
}: ImagePickerCardProps) {
  const t = useMessages(imagePickerMessages);
  const [notice, setNotice] = useState<string | null>(null);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function run(pick: () => Promise<PickResult>) {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    setCameraDenied(false);
    try {
      const result = await pick();
      if (result.status === "denied") {
        setNotice(t.cameraDenied);
        setCameraDenied(true);
      } else if (result.status === "unsupported") setNotice(t.unsupported);
      else if (result.status === "picked") {
        const { fileSize, width, height } = result.image;
        if ((fileSize !== null && fileSize > maxBytes) || width * height > MAX_PIXELS) {
          setNotice(t.tooLarge(Math.round(maxBytes / (1024 * 1024))));
        } else {
          onPick(result.image);
        }
      }
    } catch {
      setNotice(t.failed);
    } finally {
      setBusy(false);
    }
  }

  const inactive = disabled || busy;

  return (
    <Card className="gap-4">
      {image ? (
        <Image
          source={{ uri: image.uri }}
          resizeMode="contain"
          accessibilityLabel={t.previewLabel}
          className="h-72 w-full rounded-lg bg-gray-100"
        />
      ) : (
        <View className="h-48 items-center justify-center rounded-lg bg-gray-100 px-6">
          <Text className="text-center text-small text-gray-650">{t.empty}</Text>
        </View>
      )}
      {notice ? <Text className="text-small text-red-500">{notice}</Text> : null}
      {cameraDenied ? (
        <Button
          title={t.openSettings}
          variant="outline"
          onPress={() => void Linking.openSettings()}
        />
      ) : null}
      <View className="gap-2">
        <Button
          title={image ? t.change : t.pickGallery}
          variant={image ? "outline" : "primary"}
          disabled={inactive}
          onPress={() => run(pickFromLibrary)}
        />
        <Button
          title={t.takePhoto}
          variant="outline"
          disabled={inactive}
          onPress={() => run(takePhoto)}
        />
      </View>
      <Text className="text-center text-caption text-gray-650">{t.fileTypes}</Text>
    </Card>
  );
}
