import { Carousel, CarouselContent, CarouselItem } from "@/shared/components/Carousel";
import { Anime } from "@/business/types/anime";
import Image from "next/image";
import { getYouTubeThumbnail } from "@/shared/utils/youtube";

type HeroAnime = Anime & { imageUrl?: string; trailerUrl?: string };

export default function Hero({ data }: { data: HeroAnime[] }) {

	return (
		<section className="relative w-screen h-screen">
			<Carousel>
				<CarouselContent>
					{data.map((anime) => (
						<CarouselItem key={anime.mal_id}>
							<div className="relative w-full h-screen">
								<Image
									src={getYouTubeThumbnail(anime.trailerUrl) ?? ""}
									alt={anime.title}
									className="object-cover"
									fetchPriority="high"
									sizes="100vw"
									fill
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section >
	);
}