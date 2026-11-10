import { defineMessages } from "@/shared/i18n/defineMessages";

// 서버 에러 코드 목록. somaus/Signal-server의 global/exception/ErrorCode.java와 같아야 하고,
// 앱(mobile/src/shared/api/errorMessages.ts)도 같은 목록을 쓴다. 서버에 코드가 생기면 세 곳을 같이 고친다.
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
      ANONYMOUS_ID_REQUIRED: "비회원 정보를 확인할 수 없습니다. 새로고침 후 다시 시도해 주세요.",
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
      "파일을 올리는 요청의 응답 시간이 초과됐습니다. 업로드가 이미 처리됐을 수 있으니 기록을 확인한 뒤 다시 시도해 주세요.",
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
          "We couldn't identify your guest session. Please refresh and try again.",
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
        "The upload request timed out. It may have already been processed, so check your history before trying again.",
      unknown: "An unknown error occurred.",
    },
    ja: {
      codes: {
        INVALID_INPUT: "入力内容をもう一度ご確認ください。",
        UNAUTHORIZED: "ログインが必要です。",
        FORBIDDEN: "アクセス権限がありません。",
        NOT_FOUND: "お探しの情報が見つかりません。",
        CONFLICT: "すでに処理済みのリクエストです。",
        FILE_TOO_LARGE: "ファイルサイズが大きすぎます。",
        UNSUPPORTED_MEDIA_TYPE: "対応していないファイル形式です。",
        INTERNAL_SERVER_ERROR:
          "サーバーで問題が発生しました。しばらくしてからもう一度お試しください。",
        LOGIN_FAILED: "メールアドレスまたはパスワードが正しくありません。",
        EMAIL_ALREADY_EXISTS: "このメールアドレスはすでに登録されています。",
        AGREEMENT_REQUIRED: "必須の規約に同意してください。",
        CODE_MISMATCH: "認証コードが一致しません。",
        CODE_EXPIRED: "認証コードの有効期限が切れました。もう一度リクエストしてください。",
        INVALID_REFRESH_TOKEN: "ログインの有効期限が切れました。もう一度ログインしてください。",
        INVALID_VERIFICATION: "メール認証が無効です。もう一度認証してください。",
        PASSWORD_MISMATCH: "パスワードが一致しません。",
        VERIFICATION_TOO_FREQUENT:
          "認証コードのリクエストが多すぎます。しばらくしてからもう一度お試しください。",
        FACE_NOT_DETECTED: "写真から顔を検出できませんでした。",
        ANALYSIS_UNAVAILABLE: "現在、分析を行えません。しばらくしてからもう一度お試しください。",
        ANONYMOUS_ID_REQUIRED:
          "ゲスト情報を確認できません。ページを再読み込みしてもう一度お試しください。",
        ANONYMOUS_DETECTION_LIMIT_EXCEEDED:
          "ゲストの検出回数の上限に達しました。ログインすると引き続きご利用いただけます。",
        ANONYMOUS_RISK_ASSESSMENT_LIMIT_EXCEEDED:
          "ゲストの分析回数の上限に達しました。ログインすると引き続きご利用いただけます。",
        ANONYMOUS_CHAT_LIMIT_EXCEEDED:
          "ゲストの相談回数の上限に達しました。ログインすると引き続きご利用いただけます。",
        PROTECTION_NOT_READY:
          "保護処理がまだ完了していません。しばらくしてからもう一度お試しください。",
        REQUIRED_FIELD_MISSING: "必須項目を入力してください。",
        REPORT_ALREADY_FINALIZED: "完了した通報書類は編集できません。",
        WEB_SEARCH_DISABLED: "Web検索は準備中の機能です。",
        ANALYSIS_TIMEOUT:
          "画像分析がタイムアウトしました。しばらくしてからもう一度お試しください。",
        MONITORING_LIMIT_EXCEEDED:
          "登録できるモニタリング数の上限を超えました。既存のモニタリングを削除してからもう一度お試しください。",
        UNSUPPORTED_CONTENT_TYPE: "対応していないリクエスト形式です。",
        METHOD_NOT_ALLOWED: "対応していないリクエスト方式です。",
      },
      timeout: "応答に時間がかかっています。しばらくしてからもう一度お試しください。",
      network: "ネットワーク接続をご確認ください。",
      uploadTimeout:
        "ファイルアップロードの応答がタイムアウトしました。すでに処理されている可能性があるため、履歴を確認してからもう一度お試しください。",
      unknown: "不明なエラーが発生しました。",
    },
    zh: {
      codes: {
        INVALID_INPUT: "请检查输入的内容。",
        UNAUTHORIZED: "请先登录。",
        FORBIDDEN: "没有访问权限。",
        NOT_FOUND: "找不到请求的信息。",
        CONFLICT: "该请求已处理。",
        FILE_TOO_LARGE: "文件过大。",
        UNSUPPORTED_MEDIA_TYPE: "不支持该文件格式。",
        INTERNAL_SERVER_ERROR: "服务器出现问题，请稍后重试。",
        LOGIN_FAILED: "邮箱或密码不正确。",
        EMAIL_ALREADY_EXISTS: "该邮箱已注册。",
        AGREEMENT_REQUIRED: "请同意必选条款。",
        CODE_MISMATCH: "验证码不正确。",
        CODE_EXPIRED: "验证码已过期，请重新获取。",
        INVALID_REFRESH_TOKEN: "登录已过期，请重新登录。",
        INVALID_VERIFICATION: "邮箱验证已失效，请重新验证。",
        PASSWORD_MISMATCH: "密码不一致。",
        VERIFICATION_TOO_FREQUENT: "验证码请求过于频繁，请稍后重试。",
        FACE_NOT_DETECTED: "未能在照片中识别到人脸。",
        ANALYSIS_UNAVAILABLE: "暂时无法进行分析，请稍后重试。",
        ANONYMOUS_ID_REQUIRED: "无法确认访客信息，请刷新页面后重试。",
        ANONYMOUS_DETECTION_LIMIT_EXCEEDED: "访客检测次数已用完，登录后可继续使用。",
        ANONYMOUS_RISK_ASSESSMENT_LIMIT_EXCEEDED: "访客分析次数已用完，登录后可继续使用。",
        ANONYMOUS_CHAT_LIMIT_EXCEEDED: "访客咨询次数已用完，登录后可继续使用。",
        PROTECTION_NOT_READY: "保护处理尚未完成，请稍后重试。",
        REQUIRED_FIELD_MISSING: "请填写必填项。",
        REPORT_ALREADY_FINALIZED: "已完成的举报文件无法修改。",
        WEB_SEARCH_DISABLED: "网络搜索功能即将推出。",
        ANALYSIS_TIMEOUT: "图片分析超时，请稍后重试。",
        MONITORING_LIMIT_EXCEEDED: "可登记的监控数量已达上限，请删除已有监控后重试。",
        UNSUPPORTED_CONTENT_TYPE: "不支持该请求格式。",
        METHOD_NOT_ALLOWED: "不支持该请求方式。",
      },
      timeout: "响应时间过长，请稍后重试。",
      network: "请检查网络连接。",
      uploadTimeout: "文件上传请求响应超时。上传可能已完成，请先查看记录再重试。",
      unknown: "发生未知错误。",
    },
  },
);

export function isApiErrorCode(code: unknown): code is ApiErrorCode {
  return typeof code === "string" && code in errorMessages.ko.codes;
}
