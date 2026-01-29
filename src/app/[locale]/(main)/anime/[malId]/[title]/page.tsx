import type { Metadata } from "next";
import { getDetailedAnime } from "@/business/api/anime/getDetailedAnime";
import { getAnimeCharacters } from "@/business/api/anime/getAnimeCharacters";
import { getEpisodes } from "@/business/api/anime/getEpisodes";
import { notFound } from "next/navigation";
import { AnimeHeading } from "@/business/pages/DetailedAnimePage/AnimeHeading";

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

	const [animeResult, charactersResult, episodesResult] = await Promise.allSettled([
		getDetailedAnime(Number(malId)),
		getAnimeCharacters(Number(malId)),
		getEpisodes(Number(malId)),
	]);

	const animeData = animeResult.status === "fulfilled" ? animeResult.value : null;
	const charactersData =
		charactersResult.status === "fulfilled" ? charactersResult.value : null;
	const episodesData =
		episodesResult.status === "fulfilled" ? episodesResult.value : null;

	if (isNaN(Number(malId)) || !animeData) {
		notFound();
	}

	const heroData = {
		imageUrl: animeData.images?.webp?.large_image_url,
		title: animeData.title,
		titleEnglish: animeData.title_english,
		titleJapanese: animeData.title_japanese,
		titleSynonyms: animeData.title_synonyms,
		type: animeData.type,
		status: animeData.status,
		score: animeData.score,
		scoredBy: animeData.scored_by,
		rank: animeData.rank,
		popularity: animeData.popularity,
		members: animeData.members,
		season: animeData.season,
		year: animeData.year,
		studios: animeData.studios,
		schedules: animeData.broadcast.day,
	};

	return (
		<>
			<AnimeHeading heroData={heroData} />
			<p>{malId}</p>
		</>
	);
}