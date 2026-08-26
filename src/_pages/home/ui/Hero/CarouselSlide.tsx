import Image from "next/image";
import { useMemo } from "react";

import { toSnakeCase } from "@/shared/lib/text";
import { getYouTubeThumbnail } from "@/shared/lib/youtube";
import { Badge } from "@/shared/ui/Badge";
import { CarouselItem } from "@/shared/ui/Carousel";
import { AppLink } from "@/shared/ui/Link";

import { HeroAnime } from "../../model/types";

interface CarouselSlideProps {
  anime: HeroAnime;
  slideIndex: number;
}

export default function CarouselSlide({
  anime,
  slideIndex,
}: CarouselSlideProps) {
  const trailerUrl = getYouTubeThumbnail(anime.trailerUrl, "maxres");
  const imageUrl = anime.imageUrl;

  const animeStatus = useMemo(() => {
    return anime.status === "Currently Airing"
      ? "Airing"
      : anime.status === "Not yet aired"
        ? "Upcoming"
        : "Completed";
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

      <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3">
        <div className="bg-background hidden md:col-span-1 md:block" />

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
            <div className="bg-muted/50 h-full w-full"></div>
          )}
          <div className="from-background via-background/90 absolute -inset-px -left-1 bg-linear-to-t from-15% via-30% to-transparent to-70% md:bg-linear-to-r md:from-1% md:via-5% md:to-100%"></div>
        </div>
      </div>

      <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-3">
        <div className="z-20 flex flex-col gap-6 p-3 md:col-span-2 md:flex-row md:items-end md:p-8">
          <div className="hidden h-72 w-48 shrink-0 md:block">
            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg">
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

          <div className="flex flex-1 flex-col justify-end pb-9 md:justify-center md:pb-0">
            {anime.status && (
              <div className="mb-3">
                <Badge
                  variant="secondary"
                  className="bg-warning text-background hover:bg-warning/90"
                >
                  {animeStatus}
                </Badge>
              </div>
            )}

            <h3 className="text-foreground mr-10 max-w-[450px] truncate text-xl leading-normal font-bold md:text-3xl lg:max-w-[500px] lg:text-4xl xl:max-w-[700px] 2xl:max-w-[80%]">
              {anime.title}
            </h3>
            {anime.title_japanese && (
              <div className="text-muted-foreground mt-1 text-sm leading-normal font-normal md:text-base">
                {anime.title_japanese}
              </div>
            )}

            {anime.genres && (
              <div className="mt-3 flex flex-wrap gap-2">
                {anime.genres.map((genre, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-border text-xs"
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
