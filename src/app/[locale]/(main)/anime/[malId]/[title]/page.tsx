import type { Metadata } from "next";
import { getDetailedAnime } from "@/business/api/anime/getDetailedAnime";
import { getAnimeCharacters } from "@/business/api/anime/getAnimeCharacters";
import { getEpisodes } from "@/business/api/anime/getEpisodes";
import { notFound } from "next/navigation";

interface AnimePageProps {
	params: Promise<{
		malId: string;
		title: string;
	}>;
}

export async function generateMetadata({
	params,
}: AnimePageProps): Promise<Metadata> {
	const { malId } = await params;
	const animeData = await getDetailedAnime(Number(malId));

	if (isNaN(Number(malId)) || !animeData) {
		return {
			title: "Anime Not Found | AniHive",
		};
	}

	return {
		title: `${animeData.title} | AniHive`,
		description:
			animeData.synopsis?.slice(0, 160) || "View anime details on AniHive",
		openGraph: {
			title: animeData.title,
			description: animeData.synopsis?.slice(0, 160),
			images: animeData.images?.webp?.image_url
				? [animeData.images.webp.image_url]
				: [],
		},
	};
}

export default async function AnimePage({ params }: AnimePageProps) {
	const { malId, title } = await params;

	const [animeData, charactersData, episodesData] = await Promise.allSettled([
		getDetailedAnime(Number(malId)),
		getAnimeCharacters(Number(malId)),
		getEpisodes(Number(malId)),
	]);

	if (isNaN(Number(malId)) || !animeData) {
		notFound();
	}

	return (
		<div>
			<h1>{title}</h1>
			<p>{malId}</p>
		</div>
	);
}