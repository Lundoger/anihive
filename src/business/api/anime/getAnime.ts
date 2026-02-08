"use server";

import { Anime } from "@/business/types/anime";
import { fetchList } from "@/shared/api/request";
import { CACHE_CONFIG, DEFAULT_LIMITS } from "@/shared/constants/api";
import type { FetchParams } from "@/shared/types/api";
import { cleanFilters } from "@/shared/utils/utils";

interface ISearchAnimeParams extends FetchParams {
  limit: number;
  genres?: string;
  filter?: string;
  order_by?: string;
  sort?: string;
  producers?: string;
  status?: string;
}

interface IAnimeParams {
  page: number;
  type: string;
  SearchParams: ISearchAnimeParams;
}

interface IAnimeResponse {
  data: Anime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  error?: string;
}

export async function getAnime(
  { page, type, SearchParams }: IAnimeParams = {
    page: 1,
    type: "anime",
    SearchParams: { limit: DEFAULT_LIMITS.ANIME_LIST },
  },
): Promise<IAnimeResponse> {
  const { limit } = SearchParams;
  try {
    let endpoint = `/${type}`;
    const filteredParams = cleanFilters(SearchParams);

    const data = await fetchList<Anime>(
      endpoint,
      { page, limit, ...filteredParams },
      CACHE_CONFIG.SHORT,
    );

    if (!data?.data) {
      throw new Error("Invalid API response format");
    }

    const totalItems = data.pagination?.items?.total || data.data.length;
    const totalPages = data.pagination ? Math.ceil(totalItems / limit) : 1;

    return {
      data: data.data,
      totalPages,
      currentPage: page,
      totalItems,
    };
  } catch (error: unknown) {
    console.error("Error fetching anime list:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
