import { getOrCreateAnonymousId } from "@/shared/lib/anonymousId";
import { getAccessToken } from "@/shared/lib/authToken";

/** 로그인하지 않았을 때만 비회원 식별 헤더를 붙인다. */
export async function guestHeaders(): Promise<Record<string, string> | undefined> {
  return (await getAccessToken())
    ? undefined
    : { "X-Anonymous-Id": await getOrCreateAnonymousId() };
}
