import { notFound } from "next/navigation";

import { getDetailedAnime } from "@/shared/api/anime/getDetailedAnime";

import { toAnimeHeroData } from "../model/heroData";
import { AnimeHeading } from "./AnimeHeading";

interface AnimeDetailPageProps {
  malId: string;
}

export async function AnimeDetailPage({ malId }: AnimeDetailPageProps) {
  const animeData = await getDetailedAnime(Number(malId)).catch(() => null);

  if (isNaN(Number(malId)) || !animeData) {
    notFound();
  }

  return (
    <>
      <AnimeHeading heroData={toAnimeHeroData(animeData)} />
      <p>{malId}</p>
    </>
  );
}
