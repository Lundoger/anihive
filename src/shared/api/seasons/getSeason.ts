"use server";

import { CACHE_CONFIG, DEFAULT_LIMITS } from "@/shared/api/config";
import { cleanFilters } from "@/shared/api/helpers";
import { fetchList } from "@/shared/api/request";
import { Anime } from "@/shared/types/anime";
import type { FetchParams } from "@/shared/types/api";

interface ISearchSeasonParams extends FetchParams {
  limit: number;
  filter?: string;
  unapproved?: boolean;
  continuing?: boolean;
}

interface ISeasonsParams {
  page: number;
  endpoint: string;
  SearchParams: ISearchSeasonParams;
}

interface ISeasonsResponse {
  data: Anime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  error?: string;
}

export async function getSeasons(
  { page, endpoint, SearchParams }: ISeasonsParams = {
    page: 1,
    endpoint: "/seasons/now",
    SearchParams: { limit: DEFAULT_LIMITS.UPCOMING },
  },
): Promise<ISeasonsResponse> {
  const { limit } = SearchParams;
  try {
    const filteredParams = cleanFilters(SearchParams);

    const data = await fetchList<Anime>(
      endpoint,
      { page, limit, ...filteredParams },
      CACHE_CONFIG.MEDIUM,
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
