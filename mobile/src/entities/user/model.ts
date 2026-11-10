export type AuthGender = "MALE" | "FEMALE" | "NONE";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

export interface UserResponse {
  userId: number;
  email: string;
  name: string;
  age: number;
  gender: AuthGender;
  profileImageUrl?: string;
  createdAt: string;
}
