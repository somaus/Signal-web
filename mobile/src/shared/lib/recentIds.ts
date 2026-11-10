import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_RECENT = 20;

/**
 * 이 기기에서 만든 분석·탐지 번호를 최근 순으로 보관한다.
 * 비회원은 서버에 기록 목록 API가 없고(탐지는 로그인해도 없다), 앱을 껐다 켜도 진행 중인 건을 찾을 수 있어야 한다.
 */
export async function readRecentIds(key: string): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : [];
  } catch {
    return [];
  }
}

export async function pushRecentId(key: string, id: number): Promise<void> {
  try {
    const current = await readRecentIds(key);
    const next = [id, ...current.filter((value) => value !== id)].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(key, JSON.stringify(next));
  } catch {
    // 기록을 못 남겨도 분석 자체에는 영향이 없다.
  }
}
