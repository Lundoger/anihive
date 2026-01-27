"use server";

import { CACHE_CONFIG } from "@/shared/constants/api";
import { AnimeCharacter } from "@/business/types/character";
import { fetchSingle } from "@/shared/api/request";

interface AnimeCharactersResponse {
	data: AnimeCharacter[];
}

export async function getAnimeCharacters(malId: number): Promise<AnimeCharacter[]> {
	try {
		const data = await fetchSingle<AnimeCharactersResponse>(`/anime/${malId}/characters`, {}, CACHE_CONFIG.LONG);
		return data.data;
	} catch (error) {
		console.error(`Error fetching anime details for ID ${malId}:`, error);
		throw error;
	}
}