import { useLocalSearchParams } from "expo-router";
import DetectResultPage from "@/views/DetectResultPage";

export default function DetectResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DetectResultPage detectionId={Number(id)} />;
}
