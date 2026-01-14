import type { LucideIcon } from "lucide-react";
import {
  Book,
  Calendar,
  CalendarDays,
  Home,
  KeyRound,
  LogIn,
  Mail,
  RotateCcw,
  Settings,
  Tv,
  UserPlus,
} from "lucide-react";

export type NavigationMenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const NAVIGATION_MENU_ITEMS: NavigationMenuItem[] = [
  {
    title: "login",
    href: "/login",
    icon: LogIn,
  },
  {
    title: "registration",
    href: "/registration",
    icon: UserPlus,
  },
  {
    title: "verify-email",
    href: "/verify-email",
    icon: Mail,
  },
  {
    title: "forgot-password",
    href: "/forgot-password",
    icon: KeyRound,
  },
  {
    title: "reset-password",
    href: "/reset-password",
    icon: RotateCcw,
  },
  {
    title: "settings",
    href: "/settings",
    icon: Settings,
  },
];

export const NAVIGATION_MOBILE_MENU_ITEMS: NavigationMenuItem[] = [
  {
    title: "anime",
    href: "/anime-catalog",
    icon: Tv,
  },
  {
    title: "manga",
    href: "/manga-catalog",
    icon: Book,
  },
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "Releases",
    href: "/releases",
    icon: CalendarDays,
  },
];

export const PROTECTED_AUTH_PAGES: string[] = [
  "/login",
  "/registration",
  "/verify-email",
];
