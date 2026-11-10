import { useLocalSearchParams } from "expo-router";
import AnalysisResultPage from "@/views/AnalysisResultPage";

export default function AnalysisResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AnalysisResultPage assessmentId={Number(id)} />;
}
