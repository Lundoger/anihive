export interface FetchError extends Error {
  status?: number;
  url?: string;
  details?: unknown;
}

export type JikanApiErrorResponse = {
  status: number;
  type: string;
  message: string;
  error?: string;
  report_url?: string;
};

export interface PaginationData {
  current_page?: number;
  has_next_page: boolean;
  last_visible_page: number;
  items?: PaginationItems;
}

export interface PaginationItems {
  count: number;
  total: number;
  per_page: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationData;
}

export interface FetchParams {
  [key: string]: string | number | boolean | undefined | null;
}

export interface CacheConfig {
  next: {
    revalidate: number;
    tags: string[];
  };
}
