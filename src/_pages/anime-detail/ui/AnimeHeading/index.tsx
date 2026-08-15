import { StarIcon } from "lucide-react";
import { memo } from "react";

import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";

import { AnimeHeroData } from "../../model/heroData";
import AnimeBackgroundImage from "./AnimeBackgroundImage";
import AnimePoster from "./AnimePoster";
import ScheduleBadge from "./ScheduleBadge";
import StatsBadges from "./StatsBadges";
import StatusBadge from "./StatusBadge";

interface AnimeTitleProps {
  title: string;
  titleEnglish?: string | null;
  titleJapanese?: string | null;
  titleSynonyms?: string[];
}

const AnimeTitle = memo(
  ({ title, titleEnglish, titleJapanese, titleSynonyms }: AnimeTitleProps) => {
    const getAlternativeTitle = () => {
      if (titleEnglish && titleEnglish !== title) {
        return titleEnglish;
      }
      return titleJapanese || titleSynonyms?.[0] || "\u00A0";
    };

    return (
      <>
        <h1 className="from-foreground to-foreground/90 mb-1 line-clamp-2 bg-linear-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent sm:mb-2 sm:text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h1>

        <p className="text-muted-foreground/90 mb-2 line-clamp-1 min-h-4 text-xs sm:min-h-5 sm:text-sm md:min-h-6 md:text-base">
          {getAlternativeTitle()}
        </p>
      </>
    );
  },
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const StatCard = memo(({ label, value, icon }: StatCardProps) => (
  <div className="bg-card/40 border-border/20 flex flex-col items-center justify-center rounded-lg border p-3 backdrop-blur-sm">
    <div className="text-muted-foreground/80 mb-1 text-xs tracking-wider uppercase">
      {label}
    </div>
    <div className="flex items-center gap-1 text-lg font-bold sm:text-xl">
      {value}
      {icon}
    </div>
  </div>
));

interface ScoreCardProps {
  score?: number | null;
  scoredBy?: number | null;
}

const ScoreCard = ({ score, scoredBy }: ScoreCardProps) => {
  if (!score) return null;

  const formatUserCount = (count: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(count);
  };

  return (
    <div className="bg-card/40 border-border/20 flex flex-col items-center rounded-lg border p-3 backdrop-blur-sm">
      <div className="text-muted-foreground/80 mb-1 text-xs tracking-wider uppercase">
        Score
      </div>
      <div className="flex items-center gap-1 text-lg font-bold sm:text-xl">
        {score}
        <StarIcon className="h-4 w-4 text-yellow-500" />
      </div>
      {scoredBy && (
        <div className="text-muted-foreground/60 mt-0.5 text-center text-xs">
          {formatUserCount(scoredBy)} users
        </div>
      )}
    </div>
  );
};

interface StatsGridProps {
  score?: number | null;
  scoredBy?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
}

const StatsGrid = ({
  score,
  scoredBy,
  rank,
  popularity,
  members,
}: StatsGridProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      <ScoreCard score={score} scoredBy={scoredBy} />

      {rank && <StatCard label="Ranked" value={`#${rank}`} />}

      {popularity && <StatCard label="Popularity" value={`#${popularity}`} />}

      {members && <StatCard label="Members" value={formatNumber(members)} />}
    </div>
  );
};

interface AnimeHeadingProps {
  heroData: AnimeHeroData;
}

export function AnimeHeading({ heroData }: AnimeHeadingProps) {
  const {
    imageUrl,
    title,
    titleEnglish,
    titleJapanese,
    titleSynonyms,
    type,
    status,
    score,
    scoredBy,
    rank,
    popularity,
    members,
    season,
    year,
    studios,
    schedules,
  } = heroData;

  return (
    <section className="from-background/60 via-background/80 to-background relative min-h-100 w-full overflow-hidden bg-linear-to-b md:min-h-125 lg:min-h-150">
      <AnimeBackgroundImage imageUrl={imageUrl} title={title} />

      <div className="custom-container relative z-10 h-full">
        <div className="flex h-full items-end pt-20 pb-8 sm:pt-24 md:pb-10">
          <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-8 md:items-end">
            <AnimePoster imageUrl={imageUrl} title={title} />

            <div className="max-w-full flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:mb-3 sm:justify-start">
                <Badge
                  variant="secondary"
                  className="px-2.5 py-0.5 text-xs sm:text-sm"
                >
                  {type || "TV"}
                </Badge>
                <StatusBadge status={status} />
                <ScheduleBadge status={status} schedules={schedules} />
              </div>

              <AnimeTitle
                title={title}
                titleEnglish={titleEnglish}
                titleJapanese={titleJapanese}
                titleSynonyms={titleSynonyms}
              />
              <StatsBadges
                score={score}
                season={season}
                year={year}
                studios={studios}
              />
              <StatsGrid
                score={score}
                scoredBy={scoredBy}
                rank={rank}
                popularity={popularity}
                members={members}
              />

              <div className="mt-4 flex sm:hidden">
                <Button className="w-full">
                  <StarIcon className="mr-2 h-4 w-4" />
                  Add To List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
