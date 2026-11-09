import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  clearAuthTokens,
  getAccessToken,
  loadAuthTokens,
  setAuthTokens,
  subscribeAuthTokens,
} from "@/shared/lib/authToken";
import { login as requestLogin, logout as requestLogout } from "./api";
import type { LoginRequest } from "./model";

interface AuthContextValue {
  /** SecureStore에서 토큰을 읽는 중이면 true. 이 동안은 로그인 여부를 알 수 없다. */
  loading: boolean;
  loggedIn: boolean;
  /** 세션이 만료돼 로그인이 풀렸을 때 true. 사용자가 직접 로그아웃한 경우는 false. */
  sessionExpired: boolean;
  /** 만료 안내를 처리했다고 알린다(화면 이동 뒤에 부른다). */
  acknowledgeSessionExpired: () => void;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeAuthTokens((next, expired) => {
      if (!active) return;
      setLoggedIn(next);
      if (expired) setSessionExpired(true);
    });
    loadAuthTokens()
      .then(getAccessToken)
      .then((token) => {
        if (!active) return;
        setLoggedIn(token !== null);
        setLoading(false);
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const tokens = await requestLogin(payload);
    await setAuthTokens(tokens.accessToken, tokens.refreshToken);
    setSessionExpired(false);
  }, []);

  const acknowledgeSessionExpired = useCallback(() => setSessionExpired(false), []);

  const logout = useCallback(async () => {
    try {
      await requestLogout();
    } catch {
      // 서버 요청이 실패해도 기기의 로그인 정보는 지운다.
    }
    await clearAuthTokens();
  }, []);

  const value = useMemo(
    () => ({ loading, loggedIn, sessionExpired, acknowledgeSessionExpired, login, logout }),
    [loading, loggedIn, sessionExpired, acknowledgeSessionExpired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider 안에서만 사용할 수 있습니다.");
  return value;
}
