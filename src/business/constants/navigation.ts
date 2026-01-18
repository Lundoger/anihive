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
    title: "animeCatalog",
    href: "/anime-catalog",
    icon: Tv,
  },
  {
    title: "mangaCatalog",
    href: "/manga-catalog",
    icon: Book,
  },
  {
    title: "schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "releases",
    href: "/releases",
    icon: CalendarDays,
  },
];

export const NAVIGATION_MOBILE_MENU_ITEMS: NavigationMenuItem[] = [
  {
    title: "animeCatalog",
    href: "/anime-catalog",
    icon: Tv,
  },
  {
    title: "mangaCatalog",
    href: "/manga-catalog",
    icon: Book,
  },
  {
    title: "home",
    href: "/",
    icon: Home,
  },
  {
    title: "schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "releases",
    href: "/releases",
    icon: CalendarDays,
  },
];

export const PROTECTED_AUTH_PAGES: string[] = [
  "/login",
  "/registration",
  "/verify-email",
];
