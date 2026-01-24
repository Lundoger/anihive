// Reusable Next.js Page Props Types

// Base search params that most pages use
export interface BaseSearchParams {
	page?: string;
}

// Common filtering options
export interface FilterSearchParams extends BaseSearchParams {
	type?: string;
}

// Full search with all options (anime/manga main pages)
export interface FullSearchParams extends FilterSearchParams {
	q?: string;
	status?: string;
	order_by?: string;
	sort?: string;
}

// Schedule-specific params
export interface ScheduleSearchParams extends BaseSearchParams {
	day?: string;
}

// Producer-specific params
export interface ProducerSearchParams extends BaseSearchParams {
	q?: string;
	order_by?: string;
	sort?: string;
	letter?: string;
}

// Common params patterns
export interface MalIdParams {
	malId: string;
	title: string;
}

export interface SeasonParams {
	year: string;
	season: string;
}

// Reusable page props interfaces
export interface PagePropsWithSearch<T = BaseSearchParams> {
	searchParams: Promise<T>;
}

export interface PagePropsWithParams<P = MalIdParams> {
	params: Promise<P>;
}

export interface PagePropsWithBoth<P = MalIdParams, S = BaseSearchParams> {
	params: Promise<P>;
	searchParams: Promise<S>;
}

// Specific page prop types for common patterns
export type ListPageProps = PagePropsWithSearch<FilterSearchParams>;
export type SearchPageProps = PagePropsWithSearch<FullSearchParams>;
export type DetailPageProps = PagePropsWithParams<MalIdParams>;
export type DetailWithPaginationProps = PagePropsWithBoth<MalIdParams, BaseSearchParams>;
export type SeasonPageProps = PagePropsWithBoth<SeasonParams, FilterSearchParams>;
export type SchedulePageProps = PagePropsWithSearch<ScheduleSearchParams>;
export type ProducerPageProps = PagePropsWithSearch<ProducerSearchParams>;