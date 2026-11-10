import { useQuery } from "@tanstack/react-query";
import { readRecentIds } from "./recentIds";

export function recentIdsKey(storageKey: string) {
  return ["recentIds", storageKey] as const;
}

/** 이 기기에서 만든 번호 목록(최근 순). 새 번호를 저장한 뒤에는 recentIdsKey로 무효화한다. */
export function useRecentIds(storageKey: string) {
  return useQuery({
    queryKey: recentIdsKey(storageKey),
    queryFn: () => readRecentIds(storageKey),
    staleTime: 0,
  });
}
