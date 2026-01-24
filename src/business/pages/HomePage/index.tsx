import Hero from "./Hero";
import { getSeasons } from "@/business/api/getSeason";
import { DEFAULT_LIMITS } from "@/shared/constants/api";
import { Anime } from "@/business/types/anime";

export default async function HomePage() {
	const { data: upcomings } = await getSeasons({
		page: 1,
		endpoint: "/seasons/upcoming",
		SearchParams: {
			limit: DEFAULT_LIMITS.UPCOMING,
		},
	});

	const upcomingAnime = upcomings?.map((anime: Anime) => {
		return {
			imageUrl: anime.images?.webp?.large_image_url,
			trailerUrl: anime.trailer?.embed_url,
			...anime
		};
	});

	return (
		<div className="">
			<h1 className="sr-only">AniHive Home Page</h1>
			<Hero data={upcomingAnime} />
		</div>
	);
}