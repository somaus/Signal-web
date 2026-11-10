import { defineMessages } from "@/shared/i18n/defineMessages";

// 서버 에러 코드 목록. somaus/Signal-server의 global/exception/ErrorCode.java와 같아야 하고,
// 웹(Signal-web/src/shared/api/errorMessages.ts)도 같은 목록을 쓴다. 서버에 코드가 생기면 세 곳을 같이 고친다.
export type ApiErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNSUPPORTED_CONTENT_TYPE"
  | "METHOD_NOT_ALLOWED"
  | "CONFLICT"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "INTERNAL_SERVER_ERROR"
  | "LOGIN_FAILED"
  | "EMAIL_ALREADY_EXISTS"
  | "AGREEMENT_REQUIRED"
  | "CODE_MISMATCH"
  | "CODE_EXPIRED"
  | "INVALID_REFRESH_TOKEN"
  | "INVALID_VERIFICATION"
  | "PASSWORD_MISMATCH"
  | "VERIFICATION_TOO_FREQUENT"
  | "FACE_NOT_DETECTED"
  | "ANALYSIS_UNAVAILABLE"
  | "ANALYSIS_TIMEOUT"
  | "ANONYMOUS_ID_REQUIRED"
  | "ANONYMOUS_DETECTION_LIMIT_EXCEEDED"
  | "ANONYMOUS_RISK_ASSESSMENT_LIMIT_EXCEEDED"
  | "ANONYMOUS_CHAT_LIMIT_EXCEEDED"
  | "PROTECTION_NOT_READY"
  | "WEB_SEARCH_DISABLED"
  | "MONITORING_LIMIT_EXCEEDED"
  | "REQUIRED_FIELD_MISSING"
  | "REPORT_ALREADY_FINALIZED";

interface ErrorText {
  codes: Record<ApiErrorCode, string>;
  timeout: string;
  network: string;
  /** 파일 업로드가 타임아웃으로 끊겼을 때. */
  uploadTimeout: string;
  unknown: string;
}

export const errorMessages = defineMessages<ErrorText>(
  {
    codes: {
      INVALID_INPUT: "입력한 내용을 다시 확인해 주세요.",
      UNAUTHORIZED: "로그인이 필요합니다.",
      FORBIDDEN: "접근 권한이 없습니다.",
      NOT_FOUND: "요청한 정보를 찾을 수 없습니다.",
      CONFLICT: "이미 처리된 요청입니다.",
      FILE_TOO_LARGE: "파일 용량이 너무 큽니다.",
      UNSUPPORTED_MEDIA_TYPE: "지원하지 않는 파일 형식입니다.",
      INTERNAL_SERVER_ERROR: "서버에 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.",
      LOGIN_FAILED: "이메일 또는 비밀번호가 올바르지 않습니다.",
      EMAIL_ALREADY_EXISTS: "이미 가입된 이메일입니다.",
      AGREEMENT_REQUIRED: "필수 약관에 동의해 주세요.",
      CODE_MISMATCH: "인증번호가 일치하지 않습니다.",
      CODE_EXPIRED: "인증번호가 만료되었습니다. 다시 요청해 주세요.",
      INVALID_REFRESH_TOKEN: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
      INVALID_VERIFICATION: "이메일 인증이 유효하지 않습니다. 다시 인증해 주세요.",
      PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
      VERIFICATION_TOO_FREQUENT: "인증번호 요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.",
      FACE_NOT_DETECTED: "사진에서 얼굴을 찾지 못했습니다.",
      ANALYSIS_UNAVAILABLE: "지금은 분석을 할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      ANONYMOUS_ID_REQUIRED: "비회원 정보를 확인할 수 없습니다. 앱을 다시 켜고 시도해 주세요.",
      ANONYMOUS_DETECTION_LIMIT_EXCEEDED:
        "비회원 탐지 횟수를 모두 사용했습니다. 로그인하면 계속 이용할 수 있습니다.",
      ANONYMOUS_RISK_ASSESSMENT_LIMIT_EXCEEDED:
        "비회원 분석 횟수를 모두 사용했습니다. 로그인하면 계속 이용할 수 있습니다.",
      ANONYMOUS_CHAT_LIMIT_EXCEEDED:
        "비회원 상담 횟수를 모두 사용했습니다. 로그인하면 계속 이용할 수 있습니다.",
      PROTECTION_NOT_READY: "보호 처리가 아직 끝나지 않았습니다. 잠시 후 다시 시도해 주세요.",
      REQUIRED_FIELD_MISSING: "필수 항목을 입력해 주세요.",
      REPORT_ALREADY_FINALIZED: "이미 완료된 신고 문서는 수정할 수 없습니다.",
      WEB_SEARCH_DISABLED: "웹 검색은 아직 준비 중인 기능입니다.",
      ANALYSIS_TIMEOUT: "이미지 분석 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.",
      MONITORING_LIMIT_EXCEEDED:
        "등록할 수 있는 모니터링 수를 넘었습니다. 기존 모니터링을 삭제한 뒤 다시 시도해 주세요.",
      UNSUPPORTED_CONTENT_TYPE: "지원하지 않는 요청 형식입니다.",
      METHOD_NOT_ALLOWED: "지원하지 않는 요청 방식입니다.",
    },
    timeout: "응답이 늦어지고 있습니다. 잠시 후 다시 시도해 주세요.",
    network: "네트워크 연결을 확인해 주세요.",
    uploadTimeout:
      "파일을 올리는 데 시간이 너무 오래 걸려 중단됐습니다. 네트워크 상태를 확인하거나 더 작은 파일로 다시 시도해 주세요.",
    unknown: "알 수 없는 오류가 발생했습니다.",
  },
  {
    en: {
      codes: {
        INVALID_INPUT: "Please check what you entered.",
        UNAUTHORIZED: "Please log in.",
        FORBIDDEN: "You don't have permission to do this.",
        NOT_FOUND: "We couldn't find what you requested.",
        CONFLICT: "This request has already been processed.",
        FILE_TOO_LARGE: "The file is too large.",
        UNSUPPORTED_MEDIA_TYPE: "This file type isn't supported.",
        INTERNAL_SERVER_ERROR: "Something went wrong on our server. Please try again shortly.",
        LOGIN_FAILED: "Incorrect email or password.",
        EMAIL_ALREADY_EXISTS: "This email is already registered.",
        AGREEMENT_REQUIRED: "Please agree to the required terms.",
        CODE_MISMATCH: "The verification code doesn't match.",
        CODE_EXPIRED: "The verification code has expired. Please request a new one.",
        INVALID_REFRESH_TOKEN: "Your session has expired. Please log in again.",
        INVALID_VERIFICATION: "Your email verification is no longer valid. Please verify again.",
        PASSWORD_MISMATCH: "The password doesn't match.",
        VERIFICATION_TOO_FREQUENT: "Too many code requests. Please try again shortly.",
        FACE_NOT_DETECTED: "We couldn't find a face in the photo.",
        ANALYSIS_UNAVAILABLE: "Analysis isn't available right now. Please try again shortly.",
        ANONYMOUS_ID_REQUIRED:
          "We couldn't identify your guest session. Please restart the app and try again.",
        ANONYMOUS_DETECTION_LIMIT_EXCEEDED:
          "You've used all guest detections. Log in to keep using this feature.",
        ANONYMOUS_RISK_ASSESSMENT_LIMIT_EXCEEDED:
          "You've used all guest analyses. Log in to keep using this feature.",
        ANONYMOUS_CHAT_LIMIT_EXCEEDED:
          "You've used all guest chats. Log in to keep using this feature.",
        PROTECTION_NOT_READY: "Image protection isn't finished yet. Please try again shortly.",
        REQUIRED_FIELD_MISSING: "Please fill in the required fields.",
        REPORT_ALREADY_FINALIZED: "A finalized report document can't be edited.",
        WEB_SEARCH_DISABLED: "Web search is coming soon.",
        ANALYSIS_TIMEOUT: "The image analysis timed out. Please try again shortly.",
        MONITORING_LIMIT_EXCEEDED:
          "You've reached the monitoring limit. Delete an existing monitor and try again.",
        UNSUPPORTED_CONTENT_TYPE: "This request format isn't supported.",
        METHOD_NOT_ALLOWED: "This request method isn't supported.",
      },
      timeout: "The response is taking too long. Please try again shortly.",
      network: "Please check your network connection.",
      uploadTimeout:
        "The upload took too long and was stopped. Check your connection or try a smaller file.",
      unknown: "An unknown error occurred.",
    },
  },
);

export function isApiErrorCode(code: unknown): code is ApiErrorCode {
  return typeof code === "string" && code in errorMessages.ko.codes;
}
