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
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeAuthTokens((next) => {
      if (active) setLoggedIn(next);
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
  }, []);

  const logout = useCallback(async () => {
    try {
      await requestLogout();
    } catch {
      // 서버 요청이 실패해도 기기의 로그인 정보는 지운다.
    }
    await clearAuthTokens();
  }, []);

  const value = useMemo(
    () => ({ loading, loggedIn, login, logout }),
    [loading, loggedIn, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider 안에서만 사용할 수 있습니다.");
  return value;
}
