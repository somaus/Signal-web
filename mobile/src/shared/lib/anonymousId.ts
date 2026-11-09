import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const ANONYMOUS_ID_KEY = "anonymousId";

let pending: Promise<string> | null = null;

/**
 * 비회원 식별자. 처음 한 번 만들어 저장해 두고 계속 쓴다.
 * 동시에 여러 번 불려도 같은 Promise를 돌려줘서 ID가 하나만 만들어진다.
 */
export function getOrCreateAnonymousId(): Promise<string> {
  pending ??= (async () => {
    const existing = await AsyncStorage.getItem(ANONYMOUS_ID_KEY);
    if (existing) return existing;
    const id = randomUUID();
    await AsyncStorage.setItem(ANONYMOUS_ID_KEY, id);
    return id;
  })().catch((error: unknown) => {
    pending = null; // 저장소 오류면 다음 호출에서 다시 시도한다.
    throw error;
  });
  return pending;
}
