"use server";

import { CACHE_CONFIG } from "@/shared/api/config";
import { fetchSingle } from "@/shared/api/request";
import { AnimeEpisode, AnimeEpisodesResponse } from "@/shared/types/anime";

export async function getEpisodes(malId: number): Promise<AnimeEpisode[]> {
  try {
    const data = await fetchSingle<AnimeEpisodesResponse>(
      `/anime/${malId}/episodes`,
      {},
      CACHE_CONFIG.LONG,
    );
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime details for ID ${malId}:`, error);
    throw error;
  }
}
