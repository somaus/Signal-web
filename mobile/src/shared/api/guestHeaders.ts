import { getExistingAnonymousId, getOrCreateAnonymousId } from "@/shared/lib/anonymousId";
import { getAccessToken } from "@/shared/lib/authToken";

/** 로그인하지 않았을 때만 비회원 식별 헤더를 붙인다. */
export async function guestHeaders(): Promise<Record<string, string> | undefined> {
  return (await getAccessToken())
    ? undefined
    : { "X-Anonymous-Id": await getOrCreateAnonymousId() };
}

/** 로그인 때는 이미 있는 식별자만 보낸다. 저장소를 읽지 못해도 로그인은 막지 않는다. */
export async function loginGuestHeaders(): Promise<Record<string, string> | undefined> {
  try {
    if (await getAccessToken()) return undefined;
  } catch {
    return undefined;
  }
  const id = await getExistingAnonymousId();
  return id ? { "X-Anonymous-Id": id } : undefined;
}
