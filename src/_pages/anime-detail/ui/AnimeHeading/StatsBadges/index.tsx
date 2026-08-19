import { StarIcon } from "lucide-react";

import { toSnakeCase } from "@/shared/lib/text";
import { Studio } from "@/shared/types/anime";
import { AppLink } from "@/shared/ui/Link";

interface StatsBadgesProps {
  score?: number | null;
  season?: string | null;
  year?: number | null;
  studios?: Studio[];
}

const StatsBadges = ({ score, season, year, studios }: StatsBadgesProps) => {
  const formatSeason = (season?: string | null, year?: number | null) => {
    if (!season) return null;
    return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;
  };

  return (
    <div className="mt-3 mb-4 flex flex-wrap justify-center gap-x-3 gap-y-2 sm:justify-start">
      {score && (
        <div className="bg-card/60 flex items-center rounded-full border border-white/5 px-3 py-1 text-xs backdrop-blur-md">
          <StarIcon className="mr-1.5 h-3.5 w-3.5 text-yellow-500" />
          <span className="font-medium">{score}</span>
        </div>
      )}

      {season && (
        <AppLink
          href="#"
          className="bg-card/60 flex items-center rounded-full border border-white/5 px-3 py-1 text-xs backdrop-blur-md"
        >
          <span className="font-medium">{formatSeason(season, year)}</span>
        </AppLink>
      )}

      {studios?.map((studio) => (
        <AppLink
          key={studio.mal_id}
          href={`/producers/${studio.mal_id}/${toSnakeCase(studio.name)}`}
          className="bg-card/60 flex items-center rounded-full border border-white/5 px-3 py-1 text-xs backdrop-blur-md"
        >
          <span>{studio.name}</span>
        </AppLink>
      ))}
    </div>
  );
};

export default StatsBadges;
