import { defineMessages } from "@/shared/i18n/defineMessages";

export const loginMessages = defineMessages(
  {
    title: "로그인",
    email: "이메일",
    password: "비밀번호",
    submit: "로그인",
    guest: "로그인 없이 둘러보기",
    required: "이메일과 비밀번호를 입력해 주세요.",
    expired: "로그인이 만료되었어요. 다시 로그인해 주세요.",
  },
  {
    en: {
      title: "Log in",
      email: "Email",
      password: "Password",
      submit: "Log in",
      guest: "Continue as guest",
      required: "Please enter your email and password.",
      expired: "Your session has expired. Please log in again.",
    },
  },
);
