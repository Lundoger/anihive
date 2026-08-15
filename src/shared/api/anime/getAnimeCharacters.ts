"use server";

import { CACHE_CONFIG } from "@/shared/api/config";
import { fetchSingle } from "@/shared/api/request";
import { AnimeCharacter } from "@/shared/types/character";

interface AnimeCharactersResponse {
  data: AnimeCharacter[];
}

export async function getAnimeCharacters(
  malId: number,
): Promise<AnimeCharacter[]> {
  try {
    const data = await fetchSingle<AnimeCharactersResponse>(
      `/anime/${malId}/characters`,
      {},
      CACHE_CONFIG.LONG,
    );
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime details for ID ${malId}:`, error);
    throw error;
  }
}
