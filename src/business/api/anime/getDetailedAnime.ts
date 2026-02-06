"use server";

import { AnimeDetailed } from "@/business/types/anime";
import { fetchSingle } from "@/shared/api/request";
import { CACHE_CONFIG } from "@/shared/constants/api";

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
