export type AuthPageKey =
  | "login"
  | "registration"
  | "verifyEmail"
  | "forgotPassword"
  | "resetPassword";

export const AUTH_LINKS = {
  login: "/login",
  register: "/registration",
  forgotPassword: "/forgot-password",
  resendCode: "/forgot-password",
} as const;

export type AuthLinkKey = keyof typeof AUTH_LINKS;

type AuthPageConfig = {
  links: readonly AuthLinkKey[];
  oauth?: boolean;
};

export const AUTH_PAGES: Record<AuthPageKey, AuthPageConfig> = {
  login: { links: ["register", "forgotPassword"], oauth: true },
  registration: { links: ["login"], oauth: true },
  verifyEmail: { links: ["login", "forgotPassword"] },
  forgotPassword: { links: ["login"] },
  resetPassword: { links: ["resendCode", "login"] },
};
