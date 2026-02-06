import { getSfwParam } from "@/shared/api/cookies";
import { CACHE_CONFIG, JIKAN_API, RATE_LIMIT } from "@/shared/constants/api";
import {
  ApiResponse,
  CacheConfig,
  FetchError,
  FetchParams,
  JikanApiErrorResponse,
  PaginationData,
} from "@/shared/types/api";
import { toFetchError } from "@/shared/utils/utils";
import { notFound } from "next/navigation";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;

  while (attempt < RATE_LIMIT.maxRetries) {
    try {
      if (attempt > 0) {
        await delay(RATE_LIMIT.retryDelay * attempt);
      }
      return await fn();
    } catch (e) {
      attempt++;
      const err = e as FetchError;

      const retryable =
        err.status === 429 ||
        err.status === 500 ||
        err.status === 502 ||
        err.status === 503 ||
        err.status === 504 ||
        !err.status;

      if (!retryable || attempt >= RATE_LIMIT.maxRetries) throw e;
    }
  }

  throw new Error("Max retries exceeded");
}

export function buildUrl(endpoint: string, params: FetchParams = {}): string {
  const url = new URL(`${JIKAN_API}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  return url.toString();
}

async function fetchJson<T>(
  url: string,
  cacheConfig: CacheConfig,
  timeoutMs = 30000,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...cacheConfig,
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      let details: JikanApiErrorResponse | null = null;
      try {
        details = (await res.json()) as JikanApiErrorResponse;
      } catch {}

      if (res.status === 404) {
        notFound();
      }

      throw toFetchError(
        details?.message
          ? `Jikan error ${res.status}: ${details.message}`
          : `API error: ${res.status} - ${res.statusText}`,
        res.status,
        { details },
      );
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchList<T>(
  endpoint: string,
  params: FetchParams & { page: number; limit: number } = {
    page: 1,
    limit: 24,
  },
  cacheConfig: CacheConfig = CACHE_CONFIG.SHORT,
): Promise<ApiResponse<T[]>> {
  const target = params.limit;
  const startPage = params.page;

  let page = startPage;
  let all: T[] = [];
  const seenIds = new Set<number | string>();
  let attempts = 0;
  const maxAttempts = 3;

  let firstPagination: PaginationData | null = null;
  let lastPagination: PaginationData | null = null;

  while (all.length < target && attempts <= maxAttempts) {
    const remaining = target - all.length;
    const perPage = Math.min(remaining, target);

    const url = buildUrl(endpoint, { ...params, page, limit: perPage });

    const response = await withRateLimit(() =>
      fetchJson<ApiResponse<T[]>>(url, cacheConfig),
    );
    const items = (response.data ?? []) as T[];

    // Jikan/MAL can occasionally return duplicates. If items look like MAL entries
    // (have a `mal_id`), filter duplicates by that id.
    const filteredItems: T[] = [];
    for (const item of items) {
      const maybeObj = item as unknown as { mal_id?: number | string };
      const id = maybeObj?.mal_id;
      if (id === undefined || id === null) {
        filteredItems.push(item);
        continue;
      }

      if (seenIds.has(id)) continue;
      seenIds.add(id);
      filteredItems.push(item);
    }

    if (!firstPagination) firstPagination = response.pagination ?? null;
    lastPagination = response.pagination ?? lastPagination;

    all.push(...filteredItems);

    const hasNext = Boolean(response.pagination?.has_next_page);
    if (all.length < target && filteredItems.length > 0 && hasNext) {
      page++;
      attempts++;
      continue;
    }
    break;
  }

  return {
    data: all.slice(0, target),
    pagination: {
      current_page: startPage,
      has_next_page: Boolean(
        lastPagination?.has_next_page ?? firstPagination?.has_next_page,
      ),
      last_visible_page:
        lastPagination?.last_visible_page ??
        firstPagination?.last_visible_page ??
        1,
      items: {
        count: Math.min(all.length, target),
        total: firstPagination?.items?.total ?? all.length,
        per_page: target,
      },
    },
  };
}

export async function fetchSingle<T>(
  endpoint: string,
  params: FetchParams = {},
  cacheConfig: CacheConfig = CACHE_CONFIG.LONG,
): Promise<T> {
  const url = buildUrl(endpoint, { ...params });

  return withRateLimit(() => fetchJson<T>(url, cacheConfig));
}

// Experimental 18+ param to fetch from cookies
export async function fetchWithSfw<T>(
  endpoint: string,
  params: FetchParams & { page?: number; limit?: number } = {},
  cacheConfig: CacheConfig = CACHE_CONFIG.SHORT,
): Promise<ApiResponse<T[]>> {
  const sfw = await getSfwParam(); // cookie ok на сервере :contentReference[oaicite:14]{index=14}

  const target = params.limit ?? 24;
  const startPage = params.page ?? 1;

  let page = startPage;
  let all: T[] = [];
  let attempts = 0;
  const maxAttempts = 3;

  let firstPagination: PaginationData | null = null;
  let lastPagination: PaginationData | null = null;

  while (all.length < target && attempts <= maxAttempts) {
    const remaining = target - all.length;
    const perPage = Math.min(remaining, target);

    const url = buildUrl(endpoint, { ...params, page, limit: perPage, sfw });

    const response = await withRateLimit(() =>
      fetchJson<ApiResponse<T[]>>(url, cacheConfig),
    );
    const items = (response.data ?? []) as T[];

    if (!firstPagination) firstPagination = response.pagination ?? null;
    lastPagination = response.pagination ?? lastPagination;

    all.push(...items);

    const hasNext = Boolean(response.pagination?.has_next_page);
    if (all.length < target && items.length > 0 && hasNext) {
      page++;
      attempts++;
      continue;
    }
    break;
  }

  return {
    data: all.slice(0, target),
    pagination: {
      current_page: startPage,
      has_next_page: Boolean(
        lastPagination?.has_next_page ?? firstPagination?.has_next_page,
      ),
      last_visible_page:
        lastPagination?.last_visible_page ??
        firstPagination?.last_visible_page ??
        1,
      items: {
        count: Math.min(all.length, target),
        total: firstPagination?.items?.total ?? all.length,
        per_page: target,
      },
    },
  };
}
