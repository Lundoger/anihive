import { cn } from "@/shared/lib/classnames";

import { PickFallback } from "./PickFallback";
import {
  type RandomBackdropOptions,
  pickRandomBackdrop,
} from "./lib/bootstrap";

type RandomBackdropProps = {
  images: string[];
  /** Inlined data URIs in the same order as `images`, painted on the first frame. */
  previews?: string[];
  /** Skip the request entirely while the viewport is narrower than this. */
  minViewportWidth?: number;
  className?: string;
};

/**
 * Decorative backdrop that shows one of `images` at random, picked per page
 * load. Server-rendered on purpose: the markup is in the initial HTML so the
 * inline script can start the request during parsing instead of after
 * hydration. Positions itself absolutely — give the parent a positioning
 * context.
 */
export function RandomBackdrop({
  images,
  previews = [],
  minViewportWidth = 0,
  className,
}: RandomBackdropProps) {
  const options: RandomBackdropOptions = {
    selector: "img[data-random-backdrop]",
    previewSelector: "[data-random-backdrop-preview]",
    images,
    previews,
    minViewportWidth,
  };

  const bootstrapScript = `(${pickRandomBackdrop.toString()})(${JSON.stringify(options)})`;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        data-random-backdrop-preview=""
        suppressHydrationWarning
        className="absolute inset-0 scale-105 bg-cover bg-center blur-2xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image would
          need the URL at render time, but the pick happens on the client. */}
      <img
        data-random-backdrop=""
        alt=""
        suppressHydrationWarning
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 ease-out data-[loaded=true]:opacity-100"
      />
      <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      {/* Previews are stripped: they are already in the script above, and
          passing them again would repeat every data URI in the RSC payload. */}
      <PickFallback options={{ ...options, previews: [] }} />
    </div>
  );
}
