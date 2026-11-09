import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let loaded: Promise<void> | null = null;

type Listener = (loggedIn: boolean) => void;
const listeners = new Set<Listener>();

function emit() {
  const loggedIn = accessToken !== null;
  listeners.forEach((listener) => listener(loggedIn));
}

/** 앱을 켠 뒤 처음 한 번 SecureStore에서 토큰을 읽어 메모리에 올린다. */
export function loadAuthTokens(): Promise<void> {
  loaded ??= (async () => {
    try {
      [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch {
      accessToken = null;
      refreshToken = null;
    }
  })();
  return loaded;
}

export async function getAccessToken(): Promise<string | null> {
  await loadAuthTokens();
  return accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  await loadAuthTokens();
  return refreshToken;
}

export async function setAuthTokens(access: string, refresh: string): Promise<void> {
  await loadAuthTokens();
  accessToken = access;
  refreshToken = refresh;
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh),
  ]);
  emit();
}

export async function clearAuthTokens(): Promise<void> {
  await loadAuthTokens();
  accessToken = null;
  refreshToken = null;
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]).catch(() => undefined);
  emit();
}

/** 로그인 상태가 바뀔 때(로그인, 로그아웃, 토큰 만료) 호출된다. 해제 함수를 돌려준다. */
export function subscribeAuthTokens(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
