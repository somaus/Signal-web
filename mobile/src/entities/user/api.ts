import { api } from "@/shared/api/axios";
import { loginGuestHeaders } from "@/shared/api/guestHeaders";
import type { LoginRequest, TokenResponse, UserResponse } from "./model";

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/api/v1/auth/login", payload, {
    headers: await loginGuestHeaders(),
  });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/api/v1/auth/logout");
}

export async function getMyProfile(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>("/api/v1/users/me");
  return data;
}
