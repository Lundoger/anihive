"use server";

import { CACHE_CONFIG } from "@/shared/api/config";
import { fetchSingle } from "@/shared/api/request";
import { AnimeDetailed } from "@/shared/types/anime";

interface AnimeDetailedResponse {
  data: AnimeDetailed;
}

export async function getDetailedAnime(malId: number): Promise<AnimeDetailed> {
  try {
    const data = await fetchSingle<AnimeDetailedResponse>(
      `/anime/${malId}/full`,
      {},
      CACHE_CONFIG.LONG,
    );
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime details for ID ${malId}:`, error);
    throw error;
  }
}
