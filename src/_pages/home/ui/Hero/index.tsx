"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/classnames";
import { Button } from "@/shared/ui/Button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
} from "@/shared/ui/Carousel";

import { HeroAnime } from "../../model/types";
import CarouselSlide from "./CarouselSlide";

interface HeroProps {
  data: HeroAnime[];
}

export default function Hero({ data }: HeroProps) {
  const fadePlugin = useRef(Fade());
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
    }),
  );
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const syncSelected = useCallback(() => {
    if (!api) return;
    setActiveSlideIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    syncSelected();
    api.on("select", syncSelected);
    api.on("reInit", syncSelected);

    return () => {
      api.off("select", syncSelected);
      api.off("reInit", syncSelected);
    };
  }, [api, syncSelected]);

  if (!data.length) return null;

  return (
    <section aria-labelledby="hero-slider">
      <h2 id="hero-slider" className="sr-only">
        Slider shows for upcoming anime
      </h2>
      <div className="custom-container">
        <div className="relative overflow-hidden rounded-lg">
          <Carousel
            plugins={[fadePlugin.current, autoplayPlugin.current]}
            setApi={setApi}
            className="w-full"
            onMouseEnter={() => autoplayPlugin.current.stop()}
            onMouseLeave={() => autoplayPlugin.current.reset()}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {data.map((item, i) => (
                <CarouselSlide key={item.mal_id} anime={item} slideIndex={i} />
              ))}
            </CarouselContent>
          </Carousel>

          {data.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {data.map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="bare"
                  onClick={() => goToSlide(i)}
                  className={cn(
                    "h-2 w-2 rounded-full p-0 transition-all",
                    i === activeSlideIndex
                      ? "bg-primary w-6"
                      : "bg-primary/40 hover:bg-primary/30",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === activeSlideIndex ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
