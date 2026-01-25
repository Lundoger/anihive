import { CarouselItem } from "@/shared/components/Carousel";
import Image from "next/image";
import { getYouTubeThumbnail } from "@/shared/utils/youtube";
import { HeroAnime } from "../";
import { AppLink } from "@/shared/components/Link";
import { toSnakeCase } from "@/shared/utils/formatter";
import { Badge } from "@/shared/components/Badge";
import { useMemo } from "react";

interface CarouselSlideProps {
	anime: HeroAnime;
	slideIndex: number;
}

export default function CarouselSlide({ anime, slideIndex }: CarouselSlideProps) {
	const trailerUrl = getYouTubeThumbnail(anime.trailerUrl, "maxres");
	const imageUrl = anime.imageUrl;

	const animeStatus = useMemo(() => {
		return anime.status === "Currently Airing"
			? "Airing"
			: anime.status === "Not yet aired"
				? "Upcoming"
				: "Completed"
	}, [anime]);

	return (
		<CarouselItem
			key={anime.mal_id}
			className="relative h-87.5 sm:h-100 md:h-137.5 lg:h-155"
		>
			<AppLink
				href={`/anime/${anime.mal_id}/${toSnakeCase(anime.title)}`}
				className="absolute inset-0 z-30 cursor-pointer"
				aria-label={`View details for ${anime.title}`}
			/>

			<div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 z-0">
				<div className="hidden md:block bg-background md:col-span-1" />

				<div className="relative h-full md:col-span-2">
					{trailerUrl ? (
						<Image
							src={trailerUrl}
							alt={`${anime.title} background`}
							fill
							className="object-cover"
							priority={slideIndex === 0}
							quality={100}
							sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
						/>
					) : (
						<div className="w-full h-full bg-muted/50"></div>
					)}
					<div className="absolute -inset-px -left-1 bg-linear-to-t md:bg-linear-to-r from-background from-15% md:from-1% via-background/90 via-30% md:via-5% to-transparent to-70% md:to-100%"></div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 h-full relative z-10">
				<div className="flex flex-col md:flex-row md:items-end gap-6 p-3 md:p-8 z-20 md:col-span-2">
					<div className="hidden md:block w-48 h-72 shrink-0">
						<div className="w-full h-full overflow-hidden rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] relative">
							{imageUrl && (
								<Image
									src={imageUrl}
									alt={`${anime.title} cover`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
								/>
							)}
						</div>
					</div>

					<div className="flex flex-col justify-end pb-9 md:pb-0 md:justify-center flex-1">
						{anime.status && (
							<div className="mb-3">
								<Badge
									variant="secondary"
									className="bg-amber-400/90 text-black hover:bg-amber-400"
								>
									{animeStatus}
								</Badge>
							</div>
						)}

						<h3 className="text-xl lg:text-4xl md:text-3xl font-bold leading-normal text-foreground truncate mr-10 2xl:max-w-[80%] xl:max-w-[700px] lg:max-w-[500px] max-w-[450px]">
							{anime.title}
						</h3>
						{anime.title_japanese && (
							<div className="text-sm md:text-base font-normal leading-normal text-muted-foreground mt-1">
								{anime.title_japanese}
							</div>
						)}

						{anime.genres && (
							<div className="flex flex-wrap gap-2 mt-3">
								{anime.genres.map((genre, idx) => (
									<Badge
										key={idx}
										variant="outline"
										className="text-xs border-border"
									>
										{genre.name}
									</Badge>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</CarouselItem>
	);
}