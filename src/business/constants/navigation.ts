export type NavigationMenuItem = {
  title: string;
  href: string;
};

export const NAVIGATION_MENU_ITEMS: NavigationMenuItem[] = [
  {
    title: "Top Anime",
    href: "/login",
  },
  {
    title: "Top Manga",
    href: "/top-manga",
  },
  {
    title: "Top Manhua",
    href: "/top-manhua",
  },
  {
    title: "Characters",
    href: "/characters",
  },
  {
    title: "Genres",
    href: "/genres",
  },
];

export const AUTH_PAGES: string[] = [
  "/login",
  "/registration",
  "/forgot-password",
  "/verify-email",
];
