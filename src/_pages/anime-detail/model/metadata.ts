import type { Metadata } from "next";

import { getDetailedAnime } from "@/shared/api/anime/getDetailedAnime";

export async function buildAnimeDetailMetadata(
  malId: string,
): Promise<Metadata> {
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
