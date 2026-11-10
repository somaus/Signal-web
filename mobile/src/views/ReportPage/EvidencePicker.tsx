import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking, Pressable, View } from "react-native";
import { uploadReportEvidence } from "@/entities/report/api";
import type { EvidenceFile } from "@/entities/report/model";
import { colors } from "@/shared/config/colors";
import { useMessages } from "@/shared/i18n/I18nProvider";
import Button from "@/shared/ui/Button";
import Text from "@/shared/ui/Text";
import { reportMessages } from "./messages";
import type { UploadedEvidence } from "./reportForm";

// 서버가 받는 증거 파일 조건(ReportService). 미리 걸러서 업로드 시간을 아낀다.
const MAX_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

function guessMimeType(name: string, mimeType?: string | null): string | undefined {
  if (mimeType) return mimeType === "image/jpg" ? "image/jpeg" : mimeType;
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  return TYPE_BY_EXTENSION[extension];
}

type PickResult =
  { kind: "file"; file: EvidenceFile } | { kind: "error"; message: string } | { kind: "canceled" };

interface EvidencePickerProps {
  evidence: UploadedEvidence | null;
  onChange: (evidence: UploadedEvidence | null) => void;
}

/** 증거 파일 하나를 고르고 바로 서버에 올린다. 새로 고르면 이전 첨부를 바꾼다. */
export default function EvidencePicker({ evidence, onChange }: EvidencePickerProps) {
  const t = useMessages(reportMessages);

  const upload = useMutation({
    mutationFn: (file: EvidenceFile) => uploadReportEvidence(file),
    onSuccess: (result, file) => onChange({ id: result.evidenceId, name: file.name }),
    onError: (error) => Alert.alert(t.evidence.uploadFailed, error.message),
  });

  function check(name: string, mimeType: string | null | undefined, size?: number): PickResult {
    const type = guessMimeType(name, mimeType);
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return { kind: "error", message: t.evidence.unsupported };
    }
    if (size !== undefined && size > MAX_SIZE_BYTES) {
      return { kind: "error", message: t.evidence.tooLarge };
    }
    return { kind: "file", file: { uri: "", name, mimeType: type } };
  }

  function showPermissionGuide() {
    Alert.alert(t.evidence.permissionTitle, t.evidence.permissionDescription, [
      { text: t.evidence.cancel, style: "cancel" },
      { text: t.evidence.openSettings, onPress: () => void Linking.openSettings() },
    ]);
  }

  async function pickPhoto(): Promise<PickResult> {
    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
        // iOS의 HEIC 사진도 서버가 받는 JPEG로 바꿔서 받는다.
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      });
    } catch {
      // 최신 iOS·Android의 사진 선택기는 권한 없이 열려서, 오류가 났다고 권한 문제라고 단정할 수 없다.
      // 실제로 권한이 거부된 경우에만 설정 안내를 띄우고, 그 밖에는 일반 오류로 알린다.
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync().catch(() => null);
      if (permission && !permission.granted && !permission.canAskAgain) {
        showPermissionGuide();
        return { kind: "canceled" };
      }
      return { kind: "error", message: t.evidence.pickFailed };
    }
    if (result.canceled) return { kind: "canceled" };
    const asset = result.assets[0];
    const name = asset.fileName ?? `evidence-${Date.now()}.jpg`;
    const checked = check(name, asset.mimeType, asset.fileSize);
    return checked.kind === "file"
      ? { kind: "file", file: { ...checked.file, uri: asset.uri } }
      : checked;
  }

  async function pickPdf(): Promise<PickResult> {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return { kind: "canceled" };
    const asset = result.assets[0];
    const checked = check(asset.name, asset.mimeType, asset.size);
    return checked.kind === "file"
      ? { kind: "file", file: { ...checked.file, uri: asset.uri } }
      : checked;
  }

  async function pick(picker: () => Promise<PickResult>) {
    if (upload.isPending) return;
    const result = await picker();
    if (result.kind === "error") Alert.alert(result.message);
    if (result.kind === "file") upload.mutate(result.file);
  }

  return (
    <View className="gap-3">
      <View className="gap-1">
        <Text weight="medium" className="text-small text-gray-700">
          {t.evidence.title}
        </Text>
        <Text className="text-caption text-gray-650">{t.evidence.hint}</Text>
      </View>

      {evidence && !upload.isPending ? (
        <View className="flex-row items-center gap-2 rounded border border-primary-200 bg-primary-50 px-3 py-2">
          <Ionicons name="document-attach-outline" size={20} color={colors.primary600} />
          <Text className="flex-1 text-small" numberOfLines={1}>
            {t.evidence.attached(evidence.name)}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.evidence.remove}
            onPress={() => onChange(null)}
            hitSlop={8}
            className="size-10 items-center justify-center"
          >
            <Ionicons name="close-circle" size={22} color={colors.gray600} />
          </Pressable>
        </View>
      ) : null}

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button
            title={upload.isPending ? t.evidence.uploading : t.evidence.pickPhoto}
            variant="outline"
            loading={upload.isPending}
            onPress={() => void pick(pickPhoto)}
          />
        </View>
        <View className="flex-1">
          <Button
            title={t.evidence.pickFile}
            variant="outline"
            disabled={upload.isPending}
            onPress={() => void pick(pickPdf)}
          />
        </View>
      </View>
    </View>
  );
}
