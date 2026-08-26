import { cn } from "@/shared/lib/classnames";

import { PickFallback } from "./PickFallback";
import {
  type RandomBackdropOptions,
  pickRandomBackdrop,
} from "./lib/bootstrap";

type RandomBackdropProps = {
  images: string[];
  previews?: string[];
  minViewportWidth?: number;
  className?: string;
};

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

  const bootstrapMarkup = `<script>(${pickRandomBackdrop.toString()})(${JSON.stringify(
    options,
  ).replace(/</g, "\\u003c")})</script>`;

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
      <div hidden dangerouslySetInnerHTML={{ __html: bootstrapMarkup }} />
      <PickFallback options={{ ...options, previews: [] }} />
    </div>
  );
}
