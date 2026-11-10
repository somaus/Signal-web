import { getExistingAnonymousId, getOrCreateAnonymousId } from "@/shared/lib/anonymousId";
import { getAccessToken } from "@/shared/lib/authToken";

export function guestHeaders() {
  return getAccessToken() ? undefined : { "X-Anonymous-Id": getOrCreateAnonymousId() };
}

export function loginGuestHeaders() {
  const id = getAccessToken() ? null : getExistingAnonymousId();
  return id ? { "X-Anonymous-Id": id } : undefined;
}
