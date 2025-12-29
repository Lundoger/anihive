export type NavigationMenuItem = {
  title: string;
  href: string;
};

export const NAVIGATION_MENU_ITEMS: NavigationMenuItem[] = [
  {
    title: "login",
    href: "/login",
  },
  {
    title: "registration",
    href: "/registration",
  },
  {
    title: "verify-email",
    href: "/verify-email",
  },
  {
    title: "forgot-password",
    href: "/forgot-password",
  },
  {
    title: "reset-password",
    href: "/reset-password",
  },
];

export const PROTECTED_AUTH_PAGES: string[] = [
  "/login",
  "/registration",
  "/verify-email",
];
