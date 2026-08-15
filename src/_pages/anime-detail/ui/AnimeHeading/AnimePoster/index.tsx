import { StarIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

import { Button } from "@/shared/components/Button";

interface AnimePosterProps {
  imageUrl?: string | null;
  title: string;
}

const AnimePoster = memo(({ imageUrl, title }: AnimePosterProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="bg-card -mt-14 h-45 w-32.5 shrink-0 transform overflow-hidden rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.3)] ring-2 ring-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] sm:-mt-18 sm:mb-0 sm:h-52.5 sm:w-37.5 md:-mt-24 lg:h-62.5 lg:w-45">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={260}
          height={360}
          priority={true}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      )}
    </div>

    <div className="hidden w-full sm:block">
      <Button variant="outline" size="sm" className="w-full text-xs">
        <StarIcon className="mr-1.5 h-3.5 w-3.5" />
        Add To List
      </Button>
    </div>
  </div>
));

export default AnimePoster;
