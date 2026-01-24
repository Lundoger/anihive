import { PaginationData } from "@/shared/types/api";

export interface AnimeListResponse {
	data: Anime[]
	pagination?: PaginationData
}

export interface Anime {
	mal_id: number
	url: string
	images: Images
	trailer: Trailer
	approved: boolean
	titles: Title[]
	title: string
	title_english: string
	title_japanese: string
	title_synonyms: string[]
	type: string
	source: string
	episodes: number
	status: string
	airing: boolean
	aired: Aired
	duration: string
	rating: string
	score: number
	scored_by: number
	rank: number
	popularity: number
	members: number
	favorites: number
	synopsis: string
	background: string
	season: string
	year: number
	broadcast: Broadcast
	producers: Producer[]
	licensors: Licensor[]
	studios: Studio[]
	genres: Genre[]
	explicit_genres: ExplicitGenre[]
	themes: Theme[]
	demographics: Demographic[]
}

export interface Images {
	jpg: ImageLink
	webp: ImageLink
}

export interface ImageLink {
	image_url: string
	small_image_url: string
	large_image_url: string
}

export interface Trailer {
	youtube_id: string
	url: string
	embed_url: string
}

export interface Title {
	type: string
	title: string
}

export interface Aired {
	from: string
	to: string
	prop: AiredProp
}

export interface AiredProp {
	from: AiredFrom
	to: AiredTo
	string: string
}

export interface AiredFrom {
	day: number
	month: number
	year: number
}

export interface AiredTo {
	day: number
	month: number
	year: number
}

export interface Broadcast {
	day: string
	time: string
	timezone: string
	string: string
}

export interface Producer {
	mal_id: number
	type: string
	name: string
	url: string
}

export interface Licensor {
	mal_id: number
	type: string
	name: string
	url: string
}

export interface Studio {
	mal_id: number
	type: string
	name: string
	url: string
}

export interface Genre {
	mal_id: number
	type: string
	name: string
	url: string
}

export interface ExplicitGenre {
	mal_id: number
	type: string
	name: string
	url: string
}

export interface Theme {
	mal_id: number
	type: string
	name: string
	url: string
}

export interface Demographic {
	mal_id: number
	type: string
	name: string
	url: string
}
