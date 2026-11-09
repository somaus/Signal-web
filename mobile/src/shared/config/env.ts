const DEFAULT_API_URL = "https://signal.https.gsmsv.site";

/** 백엔드 주소. EXPO_PUBLIC_API_URL로 바꾸고, 없으면 배포 서버를 쓴다. */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
