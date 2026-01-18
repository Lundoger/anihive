import type { LucideIcon } from "lucide-react";
import {
	Book,
	Calendar,
	CalendarDays,
	Home,
	Tv,
} from "lucide-react";

export type NavigationMenuItem = {
	title: string;
	href: string;
	icon?: LucideIcon;
};

export type FooterNavigationSectionId = "quickLinks" | "browse" | "community";

export type FooterNavigationLink = {
	id: string;
	href: string;
	/**
	 * Translation key relative to `main.footer`.
	 * Example: `navigation.quickLinks.links.topAnime`
	 */
	titleKey: string;
};

export type FooterNavigationSection = {
	id: FooterNavigationSectionId;
	/**
	 * Translation key relative to `main.footer`.
	 * Example: `navigation.quickLinks.title`
	 */
	titleKey: string;
	links: FooterNavigationLink[];
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

export const FOOTER_NAVIGATION_MENU_ITEMS: FooterNavigationSection[] = [
	{
		id: "quickLinks",
		titleKey: "navigation.quickLinks.title",
		links: [
			{
				id: "topAnime",
				titleKey: "navigation.quickLinks.links.topAnime",
				href: "/top-anime",
			},
			{
				id: "seasonalAnime",
				titleKey: "navigation.quickLinks.links.seasonalAnime",
				href: "/seasonal-anime",
			},
			{
				id: "schedule",
				titleKey: "navigation.quickLinks.links.schedule",
				href: "/schedule",
			},
			{
				id: "upcoming",
				titleKey: "navigation.quickLinks.links.upcoming",
				href: "/upcoming",
			},
			{
				id: "producers",
				titleKey: "navigation.quickLinks.links.producers",
				href: "/producers",
			},
		],
	},
	{
		id: "browse",
		titleKey: "navigation.browse.title",
		links: [
			{
				id: "topMovies",
				titleKey: "navigation.browse.links.topMovies",
				href: "/top-movies",
			},
			{
				id: "topTvSeries",
				titleKey: "navigation.browse.links.topTvSeries",
				href: "/top-tv-series",
			},
			{
				id: "mostAnticipated",
				titleKey: "navigation.browse.links.mostAnticipated",
				href: "/most-anticipated",
			},
			{
				id: "mostPopular",
				titleKey: "navigation.browse.links.mostPopular",
				href: "/most-popular",
			},
		],
	},
	{
		id: "community",
		titleKey: "navigation.community.title",
		links: [
			{
				id: "about",
				titleKey: "navigation.community.links.about",
				href: "/about",
			},
			{
				id: "contact",
				titleKey: "navigation.community.links.contact",
				href: "/contact",
			},
			{
				id: "privacyPolicy",
				titleKey: "navigation.community.links.privacyPolicy",
				href: "/privacy-policy",
			},
			{
				id: "termsOfService",
				titleKey: "navigation.community.links.termsOfService",
				href: "/terms-of-service",
			},
		],
	},
];

export const AUTH_ONLY_PAGES: string[] = [
	"/login",
	"/registration",
	"/verify-email",
];

export const PROTECTED_PAGES: string[] = [
	"/settings",
];