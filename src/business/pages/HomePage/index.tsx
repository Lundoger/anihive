import { getSeasons } from "@/business/api/seasons/getSeason";
import { Anime } from "@/business/types/anime";
import { DEFAULT_LIMITS } from "@/shared/constants/api";
import Hero, { HeroAnime } from "./Hero";

export default async function HomePage() {
  const { data: upcomings } = await getSeasons({
    page: 1,
    endpoint: "/seasons/upcoming",
    SearchParams: {
      limit: DEFAULT_LIMITS.UPCOMING,
    },
  });

  const upcomingAnime =
    upcomings
      ?.map((anime: Anime) => {
        return {
          imageUrl: anime.images?.webp?.large_image_url,
          trailerUrl: anime.trailer?.embed_url,
          ...anime,
        };
      })
      .filter((anime: HeroAnime) => Boolean(anime.trailerUrl)) ?? [];

  return (
    <div className="">
      <h1 id="home-page" className="sr-only">
        AniHive Home Page
      </h1>
      <Hero data={upcomingAnime} />
    </div>
  );
}
