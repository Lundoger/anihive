import { AnimeDetailed, Studio } from "@/shared/types/anime";

export type AnimeHeroData = {
  imageUrl?: string | null;
  title: string;
  titleEnglish?: string | null;
  titleJapanese?: string | null;
  titleSynonyms?: string[];
  type?: string | null;
  status?: string | null;
  score?: number | null;
  scoredBy?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  season?: string | null;
  year?: number | null;
  studios?: Studio[];
  schedules?: string | null;
};

export function toAnimeHeroData(anime: AnimeDetailed): AnimeHeroData {
  return {
    imageUrl: anime.images?.webp?.large_image_url,
    schedules: anime.broadcast.day,
    scoredBy: anime.scored_by,
    titleEnglish: anime.title_english,
    titleJapanese: anime.title_japanese,
    titleSynonyms: anime.title_synonyms,
    title: anime.title,
    type: anime.type,
    status: anime.status,
    score: anime.score,
    rank: anime.rank,
    popularity: anime.popularity,
    members: anime.members,
    season: anime.season,
    year: anime.year,
    studios: anime.studios,
  };
}
