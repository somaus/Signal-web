import type { DeepfakeBand, WebMatchResponse, WebSearchResponse } from "./detectApi";

export type WebSearchOutcome =
  | "IDLE"
  | "SEARCHING"
  | "FOUND"
  | "SIMILAR_ONLY"
  | "NONE"
  | "UNAVAILABLE"
  | "FAILED";

const RAISED_BAND: Record<DeepfakeBand, DeepfakeBand> = {
  LOW: "UNCERTAIN",
  UNCERTAIN: "HIGH",
  HIGH: "HIGH",
  UNDETERMINED: "UNCERTAIN",
};

export function isSameImage(match: WebMatchResponse): boolean {
  return match.matchType === "FULL" || match.matchType === "PARTIAL";
}

export function getWebSearchOutcome(
  webSearch: WebSearchResponse | null | undefined,
): WebSearchOutcome {
  if (!webSearch) return "IDLE";
  if (webSearch.status === "PROCESSING") return "SEARCHING";
  if (webSearch.status === "UNAVAILABLE") return "UNAVAILABLE";
  if (webSearch.status === "FAILED") return "FAILED";
  const matches = webSearch.matches ?? [];
  if (matches.some(isSameImage)) return "FOUND";
  return matches.length > 0 ? "SIMILAR_ONLY" : "NONE";
}

export function raiseBand(band: DeepfakeBand): DeepfakeBand {
  return RAISED_BAND[band];
}
