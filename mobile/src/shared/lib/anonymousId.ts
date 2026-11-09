import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const ANONYMOUS_ID_KEY = "anonymousId";

let cached: string | null = null;

/** 비회원 식별자. 처음 한 번 만들어 저장해 두고 계속 쓴다. */
export async function getOrCreateAnonymousId(): Promise<string> {
  if (cached) return cached;
  const existing = await AsyncStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) {
    cached = existing;
    return existing;
  }
  const id = randomUUID();
  cached = id;
  await AsyncStorage.setItem(ANONYMOUS_ID_KEY, id);
  return id;
}
